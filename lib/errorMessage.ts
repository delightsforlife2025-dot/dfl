export function errorMessage(error: unknown, fallback = "Bir hata oluştu"): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
}
