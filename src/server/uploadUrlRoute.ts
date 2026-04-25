/**
 * POST /api/upload-url — issue a short-lived S3 pre-signed PUT URL for PDF uploads (optional legacy path).
 * POST /api/upload-pdf — server-side PDF upload to private S3 (preferred for contact flow).
 * Bucket must be private; CORS on the bucket must allow PUT from your site origin (presign path only).
 */
import { randomBytes } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import { Router, type Request, type Response } from "express";
import { isS3UploadConfigured, tryGetS3Client, uploadToS3 } from "./lib/s3Upload";

const PRESIGN_EXPIRES_SEC = 60;
const MAX_CLIENT_ID_LEN = 80;
const MAX_PDF_BYTES = 10 * 1024 * 1024;

function sanitizeClientId(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) {
    return `anon_${randomBytes(8).toString("hex")}`;
  }
  const cleaned = raw.trim().slice(0, MAX_CLIENT_ID_LEN).replace(/[^a-zA-Z0-9_-]/g, "");
  return cleaned.length > 0 ? cleaned : `anon_${randomBytes(8).toString("hex")}`;
}

const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PDF_BYTES },
  fileFilter: (_req, file, cb) => {
    const isPdfType = file.mimetype === "application/pdf";
    const isPdfName = file.originalname.toLowerCase().endsWith(".pdf");
    if (isPdfType && isPdfName) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"));
    }
  },
});

export function createUploadUrlRouter(): Router {
  const router = Router();

  router.post("/upload-pdf", (req, res, next) => {
    if (!isS3UploadConfigured()) {
      return res.status(503).json({
        error: "Upload is not configured. Set AWS_REGION, S3_BUCKET, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY on the server.",
      });
    }
    return uploadPdf.single("file")(req, res, (err) => {
      if (err) {
        if (err instanceof Error && err.message === "Only PDF files allowed") {
          return res.status(400).json({ error: "Only PDF files allowed" });
        }
        if (err && typeof err === "object" && (err as { code?: string }).code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
        }
        console.error("[upload-pdf] multer error:", err);
        return res.status(400).json({ error: "Invalid upload" });
      }
      next();
    });
  }, async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file" });
    }
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files allowed" });
    }
    try {
      const { key, url } = await uploadToS3(file.buffer, file.originalname, file.mimetype);
      console.log("📄 Uploaded file URL:", url);
      return res.status(200).json({ fileKey: key, url });
    } catch (e) {
      console.error("[upload-pdf]", e);
      return res.status(500).json({ error: "Could not upload file. Try again in a moment." });
    }
  });

  router.post("/upload-url", async (req: Request, res: Response) => {
    if (!isS3UploadConfigured() || !process.env.S3_BUCKET) {
      res.status(503).json({
        error: "Upload is not configured. Set AWS_REGION, S3_BUCKET, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY on the server.",
      });
      return;
    }

    const s3 = tryGetS3Client();
    if (!s3) {
      res.status(503).json({
        error: "Upload is not configured. Set AWS credentials and S3_BUCKET on the server.",
      });
      return;
    }

    const clientId = sanitizeClientId(req.body?.clientId);
    const ts = Date.now();
    const rand = randomBytes(4).toString("hex");
    const key = `uploads/${clientId}_${ts}_${rand}.pdf`;
    const bucket = process.env.S3_BUCKET!;

    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: "application/pdf",
        ServerSideEncryption: "AES256",
      });

      const uploadURL = await getSignedUrl(s3, command, { expiresIn: PRESIGN_EXPIRES_SEC });

      res.status(200).json({
        uploadURL,
        fileKey: key,
        expiresIn: PRESIGN_EXPIRES_SEC,
      });
    } catch (e) {
      console.error("[upload-url]", e);
      res.status(500).json({ error: "Could not create upload URL. Try again in a moment." });
    }
  });

  return router;
}