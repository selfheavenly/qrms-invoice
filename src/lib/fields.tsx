// lib/labels.ts

// Define sets of mandatory fields for invoice and line item
export const mandatoryQRMSFields = new Set(["qrmsNumber"]);

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
  type: "qrms" | "invoice" | "line"
) {
  const isMandatory =
    (type === "qrms" && mandatoryQRMSFields.has(fieldName)) ||
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

// Define headers
export const technicalHeaders = [
  "ID",
  "LEDGER_GROUP",
  "COMP_CODE",
  "DOC_DATE",
  "PSTNG_DATE",
  "FIS_PERIOD",
  "DOC_TYPE",
  "HEADER_TXT",
  "REF_DOC_NO",
  "REASON_REV",
  "PLANNED_REV_DATE",
  "EXCH_RATE",
  "POST_KEY",
  "GL_ACCOUNT",
  "ZZALTACC",
  "CUSTOMER",
  "VENDOR_NO",
  "SP_GL_IND",
  "PMNTTRMS",
  "BLINE_DATE",
  "PMNT_BLOCK",
  "CURRENCY",
  "WRBTR",
  "DMBTR",
  "DMBE3",
  "TAX_CODE",
  "ALLOC_NMBR",
  "ITEM_TEXT",
  "XREF2",
  "TRADE_ID",
  "COSTCENTER",
  "FKBER",
  "PROFIT_CTR",
  "WBS_ELEMENT",
  "ORDERID",
  "PERSON_NO",
  "QUANTITY",
  "BASE_UOM",
  "MATERIAL",
  "PLANT",
  "CROSS_COCODE",
  "COCO_NUM",
  "COPA_PRCTR",
  "COPA_WW050",
  "COPA_VKORG",
  "COPA_KMVKBU",
  "COPA_WERKS",
  "COPA_WW110",
  "COPA_KNDNR",
  "COPA_KDGRP",
  "COPA_WW210",
  "COPA_KUNRG",
  "COPA_ARTNR",
  "COPA_WW040",
  "COPA_WW080",
  "COPA_MATKL",
  "COPA_EXTWG",
  "COPA_WW010",
  "COPA_WW020",
  "COPA_WW030",
  "COPA_WW070",
  "COPA_WW100",
  "COPA_AUGRU",
  "COPA_ZZLUR",
  "COPA_WW090",
];

export const labelHeaders = [
  "Identification *",
  "Ledger",
  "Company Code*",
  "Document date*",
  "Posting date*",
  "Fiscal Period",
  "Doc type*",
  "Header text",
  "Reference",
  "Reason for reversal",
  "Reverse Posting Date",
  "Exchange rate",
  "Posting Key",
  "GL Account",
  "Local Alt account",
  "Customer",
  "Vendor",
  "Special G/L Indicator",
  "Payment terms",
  "Baseline Date",
  "Payment block",
  "Currency*",
  "Amount in Document Crcy*",
  "Amount in Local Crcy",
  "Grp cur./GpVal",
  "Tax Code *",
  "Assignment No.",
  "Item Text",
  "Item Reference",
  "Key2",
  "Trading Partner",
  "Cost Center",
  "Functional Area",
  "Profit center",
  "WBS Element",
  "Internal Order",
  "Personnel Number",
  "Quantity",
  "Unit of Measure",
  "Material",
  "Plant",
  "Cross-Company Code",
  "Condition Contract",
  "COPA-Profit Center",
  "COPA-BRS Channel",
  "COPA-Sales Organization",
  "COPA-Sales Office",
  "COPA-Plant",
  "COPA-Valuation Type",
  "COPA-Customer",
  "COPA-Customer Group",
  "COPA-Group Key Account",
  "COPA-Payer",
  "COPA-Product",
  "COPA-Product Group",
  "COPA-Req/stock Segment",
  "COPA-Material Group",
  "COPA-Ext. Material Group",
  "COPA-Rim Diameter",
  "COPA-Pattern Code",
  "COPA-Season",
  "COPA-Group Brand",
  "COPA-Europool",
  "COPA-Order Reason",
  "COPA-Third Party Vendor",
  "COPA-Group Source",
];
