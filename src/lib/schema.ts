// src/lib/schema.ts

import { z } from "zod";

const COPA_FIELDS = [
  "copaProfitCenter",
  "copaBRSChannel",
  "copaSalesOrganization",
  "copaSalesOffice",
  "copaCustomer",
  "copaProductGroup",
];

const copaSchema = z.object({
  copaProfitCenter: z.string().min(1, "Required"),
  copaBRSChannel: z.string().min(1, "Required"),
  copaSalesOrganization: z.string().min(1, "Required"),
  copaSalesOffice: z.string().min(1, "Required"),
  copaCustomer: z.string().min(1, "Required"),
  copaProduct: z.string().optional(),
  copaProductGroup: z.string().min(1, "Required"),
});

const rebillingSchema = z.object({
  crossCompanyCode: z.string().min(1, "Required"),
  tradingPartner: z.string().min(1, "Required"),
});

const lineBaseSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .refine((val) => typeof val === "number" && !isNaN(val), {
      message: "Amount must be a number",
    }),
  itemText: z.string().min(1, "Item Text is required"),
  glAccount: z.string().min(1, "GL Account is required"),
  taxCode: z.string().optional(),
});

const lineSchema = lineBaseSchema.and(
  z
    .object({
      // Add all optional conditional fields for TypeScript inference
      copaProfitCenter: z.string().optional(),
      copaBRSChannel: z.string().optional(),
      copaSalesOrganization: z.string().optional(),
      copaSalesOffice: z.string().optional(),
      copaCustomer: z.string().optional(),
      copaProduct: z.string().optional(),
      copaProductGroup: z.string().optional(),

      crossCompanyCode: z.string().optional(),
      tradingPartner: z.string().optional(),

      profitCenter: z.string().optional(),
      costCenter: z.string().optional(),
      wbsElement: z.string().optional(),
      taxCode: z.string().optional(),
    })
    .refine(
      (data) => {
        const copaValid =
          data.copaProfitCenter &&
          data.copaBRSChannel &&
          data.copaSalesOrganization &&
          data.copaSalesOffice &&
          data.copaCustomer &&
          data.copaProductGroup;

        const rebillingRequired =
          data.taxCode === "S3" || data.taxCode === "S4";
        const rebillingValid =
          !rebillingRequired || (data.crossCompanyCode && data.tradingPartner);

        const profitCenterValid = !!data.profitCenter;
        const costCenterValid = !!data.costCenter;
        const wbsElementValid = !!data.wbsElement;

        return (
          (copaValid && !rebillingRequired) ||
          (rebillingValid && !copaValid) ||
          profitCenterValid ||
          costCenterValid ||
          wbsElementValid
        );
      },
      {
        message:
          "At least one conditional group (COPA / Rebilling / Profit Center / Cost Center / WBS Element) must be valid",
      }
    )
);

export const invoiceSchema = z.object({
  companyCode: z.string().min(1, "Company Code required"),
  documentType: z.string().min(1, "Document Type required"),
  documentDate: z.string().min(1, "Document Date required"),
  customer: z.string().min(1, "Customer required"),
  currency: z.string().min(1, "Currency required"),
  headerText: z.string().optional(),
  lines: z.array(lineSchema).min(1, "At least one line item is required"),
});

export const formSchema = z.object({
  qrmsNumber: z.string().min(1, "QRMS Number required"),
  invoices: z.array(invoiceSchema).min(1, "At least one invoice required"),
});

// ✅ Export types based on schema

export type LineItem = z.infer<typeof lineSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type FormValues = z.infer<typeof formSchema>;
