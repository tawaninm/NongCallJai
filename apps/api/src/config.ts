import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: false, quiet: true });
dotenv.config({ override: false, quiet: true });

export function readConfiguredEnv(key: string) {
  const value = process.env[key]?.trim();
  if (!value) return undefined;

  const lowerValue = value.toLowerCase();
  if (
    value.startsWith("YOUR_") ||
    lowerValue.includes("voice_med_liff_id") ||
    lowerValue.includes("your-domain.com") ||
    lowerValue.includes("lin.ee/...")
  ) {
    return undefined;
  }

  return value;
}

export function isConfiguredEnv(key: string) {
  return Boolean(readConfiguredEnv(key));
}

export function getLiffBaseUrl() {
  const explicitBaseUrl = readConfiguredEnv("LIFF_BASE_URL");
  if (explicitBaseUrl) return explicitBaseUrl;

  const liffId = readConfiguredEnv("LIFF_ID");
  if (liffId) return `https://liff.line.me/${liffId}`;

  return "https://liff.line.me/VOICE_MED_LIFF_ID";
}

export const port = Number(process.env.PORT ?? 8787);
