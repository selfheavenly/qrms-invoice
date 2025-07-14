import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format: 01.01.2024
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

// Format: 1,234.56
export function formatAmount(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// lineType: "summary" or "line"
// docType: invoice document type string
export function getPostingKey(
  docType: string = "",
  lineType: "summary" | "line" = "line"
): string {
  const isCN = docType.startsWith("2") || docType === "DG";

  if (lineType === "summary") {
    // Summary rows use 01 for invoices, 11 for CN
    return isCN ? "11" : "01";
  } else {
    // Line items use 40 for CN, 50 for invoices
    return isCN ? "40" : "50";
  }
}
