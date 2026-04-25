// IHL Deal Desk Partner Access Codes
// Each code is unique per agent — format: [initials]-[4 digits]
// To add a new partner: add their code to this array
// To revoke access: remove their code

export const VALID_CODES = [
  "DEALDESK2026", // Master code — for demos and new partner intros
  "IHL-AGENT", // Generic partner code
  // Individual agent codes added here as partners are onboarded
  // Example format: 'JD-4829', 'SM-7731', 'KL-2284'
];

// Cookie name and duration
export const COOKIE_NAME = "ihl_deal_desk_access";
export const COOKIE_DAYS = 90;
