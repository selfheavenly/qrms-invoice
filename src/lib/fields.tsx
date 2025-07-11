// lib/labels.ts

// Define sets of mandatory fields for invoice and line item
export const mandatoryInvoiceFields = new Set([
  "companyCode",
  "documentType",
  "documentDate",
  "customer",
  "currency",
]);

export const mandatoryLineFields = new Set(["amount", "itemText", "glAccount"]);

// Reusable function to render label with mandatory/optional marks
import React from "react";

export function renderLabel(
  fieldName: string,
  label: string,
  type: "invoice" | "line"
) {
  const isMandatory =
    (type === "invoice" && mandatoryInvoiceFields.has(fieldName)) ||
    (type === "line" && mandatoryLineFields.has(fieldName));

  return (
    <>
      {label}{" "}
      {isMandatory ? (
        <span className="text-red-500" aria-label="mandatory">
          *
        </span>
      ) : (
        <span className="text-gray-500 italic">(optional)</span>
      )}
    </>
  );
}
