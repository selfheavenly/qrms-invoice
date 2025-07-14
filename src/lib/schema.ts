import { z } from "zod";

// === Allowed values ===
export const allowedCompanyCodes = [
  "CBG1",
  "CSZ1",
  "CCR1",
  "CDK1",
  "CTC1",
  "C004",
  "CFR1",
  "CES2",
  "CES1",
  "CDL1",
  "CIT2",
  "CNL1",
  "CBE1",
  "CAU1",
  "CRI1",
  "CPO1",
  "CFN1",
  "CIT1",
  "CLT1",
  "CSK1",
  "CLV1",
  "CDL4",
  "CBE2",
  "CUK1",
  "CHU1",
  "CHU2",
  "CPZ2",
  "CPS1",
  "CPS3",
  "C007",
  "CRO1",
  "CSW1",
  "CAE1",
];

export const allowedCurrencies = [
  "EUR",
  "BGN",
  "CHF",
  "CZK",
  "DKK",
  "NOK",
  "SEK",
  "ZAR",
  "USD",
  "JPY",
  "GBP",
  "RON",
  "HUF",
  "PLN",
  "AED",
];

export const allowedDocumentTypes = [
  "1A",
  "1B",
  "1C",
  "1D",
  "1E",
  "1F",
  "1G",
  "1H",
  "1I",
  "1J",
  "1K",
  "1L",
  "1N",
  "1P",
  "1R",
  "1S",
  "1T",
  "1U",
  "1W",
  "1X",
  "1Z",
  "2A",
  "2B",
  "2C",
  "2D",
  "2E",
  "2F",
  "2G",
  "2H",
  "2I",
  "2J",
  "2K",
  "2L",
  "2M",
  "2N",
  "2P",
  "2R",
  "2S",
  "2T",
  "2U",
  "2W",
  "2X",
  "2Z",
  "AB",
  "DA",
  "DG",
  "DK",
  "DR",
  "DS",
  "H1",
  "H2",
  "KZ",
  "MA",
  "MB",
  "PA",
  "RC",
  "RV",
  "S1",
  "S2",
  "S3",
  "S4",
  "TS",
  "UP",
  "ZP",
  "ZQ",
  "ZV",
];

// === Field schemas ===

const companyCodeSchema = z
  .string()
  .length(4, "Company Code must be exactly 4 characters")
  .refine((val) => allowedCompanyCodes.includes(val), {
    message: "Invalid Company Code",
  });

const documentTypeSchema = z
  .string()
  .length(2, "Document Type must be exactly 2 characters")
  .refine((val) => allowedDocumentTypes.includes(val), {
    message: "Invalid Document Type",
  });

const customerSchema = z
  .string()
  .min(4, "Customer must be at least 4 characters")
  .regex(/^\d+$/, "Customer must contain digits only");

const currencySchema = z
  .string()
  .length(3, "Currency must be exactly 3 characters")
  .refine((val) => allowedCurrencies.includes(val), {
    message: "Invalid Currency",
  });

const glAccountSchema = z
  .string()
  .min(2, "GL Account must be at least 2 characters")
  .regex(/^\d+$/, "GL Account must contain digits only")
  .refine((val) => val.length === 8, {
    message: "GL Account must be 8 digits",
  });

const taxCodeSchema = z
  .string()
  .optional()
  .refine((val) => val === undefined || val === "" || val.length === 2, {
    message: "Invalid Tax Code (must be 2 characters)",
  });

// === Line Item Schema ===

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

      documentType: z.string().optional(), // optional for now
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
  );

// === Invoice & Form Schemas ===

export const invoiceSchema = z.object({
  companyCode: companyCodeSchema,
  documentType: documentTypeSchema,
  documentDate: z.string().min(1, "Document Date required"),
  customer: customerSchema,
  currency: currencySchema,
  headerText: z.string().optional(),
  lines: z.array(lineSchema).min(1, "At least one line item is required"),
});

export const formSchema = z.object({
  qrmsNumber: z.string().min(2, "QRMS Number must be at least 2 characters"),
  invoices: z.array(invoiceSchema).min(1, "At least one invoice required"),
});

// === Types ===

export type LineItem = z.infer<typeof lineSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type FormValues = z.infer<typeof formSchema>;
