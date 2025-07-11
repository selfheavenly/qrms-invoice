// src/lib/schema.ts
import { z } from "zod";

// === Mock allowed values, replace with real data later ===
const allowedCompanyCodes = ["1000", "2000", "3000"];
const allowedDocumentTypes = ["DR", "CR", "IN"];
const allowedCurrencies = ["USD", "EUR", "PLN"];
const allowedTaxCodes = ["S1", "S2", "S3", "S4"];

// Removed unused COPA_FIELDS and copaSchema as they were not referenced

const rebillingSchema = z.object({
  crossCompanyCode: z.string().min(1, "Required"),
  tradingPartner: z.string().min(1, "Required"),
});

// Base schemas with enhanced validation
const companyCodeSchema = z
  .string()
  .min(2, "Company Code must be at least 2 characters")
  .refine((val) => allowedCompanyCodes.includes(val), {
    message: "Invalid Company Code",
  });

const documentTypeSchema = z
  .string()
  .min(2, "Document Type must be at least 2 characters")
  .refine((val) => allowedDocumentTypes.includes(val), {
    message: "Invalid Document Type",
  });

const customerSchema = z
  .string()
  .min(2, "Customer must be at least 2 characters")
  .regex(/^\d+$/, "Customer must contain digits only");

const currencySchema = z
  .string()
  .min(2, "Currency must be at least 2 characters")
  .refine((val) => allowedCurrencies.includes(val), {
    message: "Invalid Currency",
  });

const glAccountSchema = z
  .string()
  .min(2, "GL Account must be at least 2 characters");

const taxCodeSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      return allowedTaxCodes.includes(val);
    },
    {
      message: "Invalid Tax Code",
    }
  );

// Base line schema
const lineBaseSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .refine((val) => typeof val === "number" && !isNaN(val), {
      message: "Amount must be a number",
    }),
  itemText: z.string().min(2, "Item Text must be at least 2 characters"),
  glAccount: glAccountSchema,
  taxCode: taxCodeSchema,
});

// Full line schema with conditional groups and taxCode-documentType dependency
const lineSchema = lineBaseSchema
  .and(
    z.object({
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

      documentType: z.string().optional(), // needed for taxCode check
    })
  )
  .refine(
    (data) => {
      const copaValid =
        !!data.copaProfitCenter &&
        !!data.copaBRSChannel &&
        !!data.copaSalesOrganization &&
        !!data.copaSalesOffice &&
        !!data.copaCustomer &&
        !!data.copaProductGroup;

      const rebillingRequired = data.taxCode === "S3" || data.taxCode === "S4";
      const rebillingValid =
        !rebillingRequired ||
        (!!data.crossCompanyCode && !!data.tradingPartner);

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
  .check((ctx) => {
    const { value } = ctx;

    // Tax code must be valid for the documentType (if both present)
    if (value.taxCode && value.documentType) {
      const allowedTaxCodesForDocType: Record<string, string[]> = {
        DR: ["S1", "S2"],
        CR: ["S3", "S4"],
        IN: ["S1", "S4"],
      };
      const allowedForDoc = allowedTaxCodesForDocType[value.documentType] || [];
      if (!allowedForDoc.includes(value.taxCode)) {
        ctx.issues.push({
          code: "custom",
          message: `Tax Code ${value.taxCode} is invalid for Document Type ${value.documentType}`,
          path: ["taxCode"],
          input: value,
        });
      }
    }
  });

// Invoice schema with enhanced validations
export const invoiceSchema = z.object({
  companyCode: companyCodeSchema,
  documentType: documentTypeSchema,
  documentDate: z.string().min(1, "Document Date required"), // Add date format validation if needed
  customer: customerSchema,
  currency: currencySchema,
  headerText: z.string().optional(),
  lines: z.array(lineSchema).min(1, "At least one line item is required"),
});

// Top-level form schema
export const formSchema = z.object({
  qrmsNumber: z.string().min(2, "QRMS Number must be at least 2 characters"),
  invoices: z.array(invoiceSchema).min(1, "At least one invoice required"),
});

// Export types
export type LineItem = z.infer<typeof lineSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type FormValues = z.infer<typeof formSchema>;
