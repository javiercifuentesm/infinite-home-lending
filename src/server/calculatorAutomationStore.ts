import { GetObjectCommand, PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import type { ReportRequest } from "../lib/calculatorReport";

export type JobKind = "crm" | "report" | "advisor" | "day2" | "day5" | "conversation";
export type Job = { status: "pending" | "running" | "accepted" | "done" | "review" | "cancelled"; dueAt: number; attempts: number; claimedAt?: number; lastDeliveryCheck?: number; messageId?: string; error?: string };
export type CalculatorLead = {
  request: ReportRequest; createdAt: number; consentDisclosure: string; consentVersion: string;
  calculationVersion: string; fingerprint: string; contactId?: string; noteId?: string;
  deliveredAt?: number; lastDeliveryCheck?: number; stopReason?: string; conversationAt?: number;
  jobs: Partial<Record<JobKind, Job>>;
};
export type CalculatorState = { version: 1; leads: Record<string, CalculatorLead>; suppressedEmails: Record<string, { at: number; reason: string }> };
export interface CalculatorStore {
  read(): Promise<CalculatorState>;
  mutate<T>(change: (state: CalculatorState) => T): Promise<T>;
}
export const emptyCalculatorState = (): CalculatorState => ({ version: 1, leads: {}, suppressedEmails: {} });

/** One encrypted private object, bounded to the pilot; conditional writes prevent lost updates. */
export class S3CalculatorStore implements CalculatorStore {
  constructor(private client: S3Client, private bucket: string, private key = "uploads/automation/calculator-pilot-v1.json") {}
  private async snapshot(): Promise<{ state: CalculatorState; etag?: string }> {
    try {
      const result = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: this.key }));
      const state = JSON.parse(await result.Body!.transformToString()) as CalculatorState;
      if (state.version !== 1 || !state.leads || !state.suppressedEmails) throw new Error("Invalid calculator state");
      return { state, etag: result.ETag };
    } catch (error) {
      if ((error as { name?: string }).name === "NoSuchKey") return { state: emptyCalculatorState() };
      throw error;
    }
  }
  async read() { return (await this.snapshot()).state; }
  async mutate<T>(change: (state: CalculatorState) => T): Promise<T> {
    for (let attempt = 0; attempt < 8; attempt++) {
      const { state, etag } = await this.snapshot();
      const result = change(state);
      try {
        await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: this.key, Body: JSON.stringify(state), ContentType: "application/json", ServerSideEncryption: "AES256", ...(etag ? { IfMatch: etag } : { IfNoneMatch: "*" }) }));
        return result;
      } catch (error) {
        const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
        if (status !== 409 && status !== 412) throw error;
      }
    }
    throw new Error("Calculator storage contention");
  }
}
