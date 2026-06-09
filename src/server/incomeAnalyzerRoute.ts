import { Router } from "express";
import multer from "multer";
import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";


const LOAN_PROGRAMS = ["conventional", "fha", "va", "usda", "jumbo", "nonqm"] as const;
type LoanProgram = (typeof LOAN_PROGRAMS)[number];

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 5;

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; source: { type: "base64"; media_type: "image/jpeg" | "image/png"; data: string } }
  | { type: "document"; source: { type: "base64"; media_type: "application/pdf"; data: string } };

export type IncomeAnalysis = {
  loanProgram: string;
  borrowerName: string;
  documentsSummary: string;
  incomeTypes: Array<{
    type: string;
    employer?: string;
    annualAmount: number;
    monthlyAmount: number;
    notes?: string;
  }>;
  totalAnnualIncome: number;
  totalMonthlyIncome: number;
  qualifyingIncome: number;
  qualifyingMonthlyIncome: number;
  guidelineApplied: string;
  adjustments: Array<{ description: string; impact: number }>;
  flags: Array<{ severity: "high" | "medium" | "low"; issue: string; recommendation: string }>;
  readyFor1003: boolean;
  confidence: "high" | "medium" | "low";
  maActionItems: string[];
  disclaimer: string;
  rawAnalysis?: string;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    const allowed = new Set(["application/pdf", "image/jpeg", "image/png"]);
    if (allowed.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only PDF, JPG, and PNG files are allowed"));
  },
});

function stripJsonFence(text: string): string {
  const t = text.trim();
  const fenceMatch = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) return fenceMatch[1].trim();
  const firstBrace = t.indexOf("{");
  const lastBrace = t.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return t.slice(firstBrace, lastBrace + 1).trim();
  }
  return t;
}

function parseIncomeAnalysis(rawText: string): IncomeAnalysis {
  const cleaned = stripJsonFence(rawText);
  try {
    return JSON.parse(cleaned) as IncomeAnalysis;
  } catch {
    return {
      loanProgram: "",
      borrowerName: "Borrower",
      documentsSummary: "",
      incomeTypes: [],
      totalAnnualIncome: 0,
      totalMonthlyIncome: 0,
      qualifyingIncome: 0,
      qualifyingMonthlyIncome: 0,
      guidelineApplied: "",
      adjustments: [],
      flags: [],
      readyFor1003: false,
      confidence: "medium",
      maActionItems: [],
      disclaimer:
        "This analysis is based on documents provided and should be verified by a licensed underwriter before submission.",
      rawAnalysis: rawText,
    };
  }
}

function buildUserPrompt(loanProgram: string, borrowerName: string): string {
  return `Analyze these income documents for ${borrowerName || "the borrower"} applying for a ${loanProgram.toUpperCase()} loan.

Provide your analysis in this EXACT JSON format (raw JSON only, no markdown, no backticks):
{
  "loanProgram": "${loanProgram}",
  "borrowerName": "${borrowerName || "Borrower"}",
  "documentsSummary": "Brief description of documents analyzed",
  "incomeTypes": [
    {
      "type": "W2 Employment" | "Self-Employment" | "Rental Income" | "Social Security" | "Retirement/Pension" | "Other",
      "employer": "employer or source name if visible",
      "annualAmount": 0.00,
      "monthlyAmount": 0.00,
      "notes": "specific line items referenced e.g. W2 Box 1, Schedule C Line 31"
    }
  ],
  "totalAnnualIncome": 0.00,
  "totalMonthlyIncome": 0.00,
  "qualifyingIncome": 0.00,
  "qualifyingMonthlyIncome": 0.00,
  "guidelineApplied": "Specific guideline reference e.g. Fannie Mae B3-3.1-01, HUD 4000.1 Section II.A.4",
  "adjustments": [
    {
      "description": "e.g. 2-year average applied for self-employment",
      "impact": -0.00
    }
  ],
  "flags": [
    {
      "severity": "high" | "medium" | "low",
      "issue": "Description of flag",
      "recommendation": "What the MA should do"
    }
  ],
  "readyFor1003": true | false,
  "confidence": "high" | "medium" | "low",
  "maActionItems": ["action 1", "action 2"],
  "disclaimer": "This analysis is based on documents provided and should be verified by a licensed underwriter before submission."
}`;
}

function fileToContentBlock(file: Express.Multer.File): ContentBlock {
  const base64 = file.buffer.toString("base64");
  if (file.mimetype === "application/pdf") {
    return {
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: base64 },
    };
  }
  return {
    type: "image",
    source: {
      type: "base64",
      media_type: file.mimetype as "image/jpeg" | "image/png",
      data: base64,
    },
  };
}

export function createIncomeAnalyzerRouter() {
  const router = Router();

  router.post("/analyze-income", (req, res) => {
    upload.array("files", MAX_FILES)(req, res, async (err) => {
      if (err) {
        const message =
          err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
            ? "Each file must be 10MB or less"
            : err instanceof Error
              ? err.message
              : "Upload failed";
        res.status(400).json({ ok: false, error: message });
        return;
      }

      try {
        const loanProgramRaw = typeof req.body.loanProgram === "string" ? req.body.loanProgram.trim() : "";
        const borrowerName =
          typeof req.body.borrowerName === "string" ? req.body.borrowerName.trim() : "";
        const files = (req.files as Express.Multer.File[] | undefined) ?? [];

        if (!LOAN_PROGRAMS.includes(loanProgramRaw as LoanProgram)) {
          res.status(400).json({ ok: false, error: "Valid loanProgram is required" });
          return;
        }

        if (files.length === 0) {
          res.status(400).json({ ok: false, error: "At least one file is required" });
          return;
        }

        const apiKey = process.env.ANTHROPIC_API_KEY ?? "";
        if (!apiKey) {
          res.status(500).json({ ok: false, error: "ANTHROPIC_API_KEY not configured" });
          return;
        }
        const client = new Anthropic({ apiKey });

        const loanProgram = loanProgramRaw as LoanProgram;
        const contentBlocks: ContentBlock[] = files.map(fileToContentBlock);
        contentBlocks.push({
          type: "text",
          text: buildUserPrompt(loanProgram, borrowerName),
        });

        const response = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 2000,
          system:
            "You are Alfred, an expert mortgage income analyst for Infinite Home Lending. You analyze income documents with the precision of a senior underwriter. Always cite specific line items, form numbers, and guideline references. Be exact with numbers.",
          messages: [{ role: "user", content: contentBlocks }] as MessageParam[],
        });

        const rawText =
          response.content[0]?.type === "text" ? response.content[0].text.trim() : "";

        if (!rawText) {
          res.status(500).json({ ok: false, error: "Empty analysis response" });
          return;
        }

        const analysis = parseIncomeAnalysis(rawText);
        res.json({ ok: true, analysis, analyzedAt: new Date().toISOString() });
      } catch (analysisErr) {
        console.error("[analyze-income] failed:", analysisErr);
        res.status(500).json({ ok: false, error: "Income analysis failed" });
      }
    });
  });

  return router;
}
