import { apiUrl } from "../lib/apiBase";

export async function sendLeadEmail(params: {
  lead_name: string;
  lead_email: string;
  lead_phone: string;
  best_day: string;
  best_time: string;
  preferred_contact: string;
  lead_grade: string;
  lead_emoji: string;
  lead_color: string;
  lead_bg: string;
  lead_priority: string;
  date: string;
  time: string;
  transcript: string;
  /** When set, used as email subject instead of the default concierge subject */
  lead_subject_override?: string;
}) {
  const response = await fetch(apiUrl("/api/send-lead"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lead_name: params.lead_name,
      lead_email: params.lead_email,
      lead_phone: params.lead_phone,
      best_day: params.best_day,
      best_time: params.best_time,
      preferred_contact: params.preferred_contact,
      lead_grade: params.lead_grade,
      lead_emoji: params.lead_emoji,
      lead_color: params.lead_color,
      lead_bg: params.lead_bg,
      lead_priority: params.lead_priority,
      date: params.date,
      time: params.time,
      transcript: params.transcript,
      ...(params.lead_subject_override
        ? { lead_subject_override: params.lead_subject_override }
        : {}),
    }),
  });

  if (!response.ok) {
    const error = (await response.json()) as { message?: string };
    throw new Error(error.message || "Failed to send email");
  }

  return response.json();
}
