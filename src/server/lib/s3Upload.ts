import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function sanitizeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.length > 0 ? base.slice(0, 200) : "document.pdf";
}

export function isS3UploadConfigured(): boolean {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.S3_BUCKET,
  );
}

/** Shared client for presigned URLs, PutObject, and GetObject. */
export function getS3Client(): S3Client {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing AWS_REGION, AWS_ACCESS_KEY_ID, or AWS_SECRET_ACCESS_KEY");
  }
  return new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function tryGetS3Client(): S3Client | null {
  try {
    if (!isS3UploadConfigured()) return null;
    return getS3Client();
  } catch {
    return null;
  }
}

/**
 * Server-side upload to private bucket. Returns the object key and a virtual-hosted–style URL (for logging;
 * the bucket remains private; advisor emails use presigned GET via submit-lead).
 */
export async function uploadToS3(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<{ key: string; url: string }> {
  const client = getS3Client();
  const bucket = process.env.S3_BUCKET;
  if (!bucket) {
    throw new Error("S3_BUCKET is not set");
  }
  const region = process.env.AWS_REGION!;
  const safe = sanitizeFileName(fileName);
  const key = `uploads/${Date.now()}-${safe}`;

  console.log("📤 Uploading file to S3...");
  console.log("📦 File name:", fileName);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    ServerSideEncryption: "AES256",
  });

  await client.send(command);

  const host =
    region === "us-east-1"
      ? `https://${bucket}.s3.amazonaws.com/${key}`
      : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { key, url: host };
}
