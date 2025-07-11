import { z } from "zod";

const COPA_FIELDS = [
  "copaProfitCenter",
  "copaBRSChannel",
  "copaSalesOrganization",
  "copaSalesOffice",
  "copaCustomer",
  // product is optional
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

const lineConditionalSchema = z.union([
  // a) COPA group (all required except product optional)
  copaSchema,
  // b) Rebilling if taxCode is S3 or S4
  rebillingSchema,
  // c) Profit Center only
  z.object({ profitCenter: z.string().min(1, "Required") }),
  // d) Cost Center only
  z.object({ costCenter: z.string().min(1, "Required") }),
  // e) WBS Element only
  z.object({ wbsElement: z.string().min(1, "Required") }),
]);

export const lineSchema = lineBaseSchema.and(
  z.object({}).refine(
    (data) => {
      // At least one conditional group must be valid

      // COPA check
      const copaValid =
        data.copaProfitCenter &&
        data.copaBRSChannel &&
        data.copaSalesOrganization &&
        data.copaSalesOffice &&
        data.copaCustomer &&
        data.copaProductGroup;

      // Rebilling required if taxCode S3 or S4
      const rebillingRequired = data.taxCode === "S3" || data.taxCode === "S4";
      const rebillingValid =
        !rebillingRequired || (data.crossCompanyCode && data.tradingPartner);

      // Profit Center only
      const profitCenterValid = !!data.profitCenter;

      // Cost Center only
      const costCenterValid = !!data.costCenter;

      // WBS Element only
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
      path: [],
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
