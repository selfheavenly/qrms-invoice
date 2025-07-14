import * as XLSX from "xlsx";

// Format: 01.01.2024
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

// Format: 1,234.56
function formatAmount(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Determine posting key
function getPostingKey(docType: string = ""): string {
  return docType.startsWith("2") ? "50" : "40";
}

// Define headers
const technicalHeaders = [
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

const labelHeaders = [
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

export function exportToExcel(data: any) {
  const today = new Date();
  const formattedToday = formatDate(today.toISOString());

  const rows: any[] = [];

  data.invoices.forEach((invoice: any, invIndex: number) => {
    const invoiceId = invIndex + 1;
    const postKey = getPostingKey(invoice.documentType);
    const qrmsRef = data.qrmsNumber ? `QRMS ${data.qrmsNumber}` : "";

    invoice.lines.forEach((line: any) => {
      const amount = Number(line.amount || 0);
      const row = {
        ID: invoiceId,
        LEDGER_GROUP: "",
        COMP_CODE: invoice.companyCode || "",
        DOC_DATE: formatDate(invoice.documentDate),
        PSTNG_DATE: formattedToday,
        FIS_PERIOD: "",
        DOC_TYPE: invoice.documentType || "",
        HEADER_TXT: invoice.headerText || "",
        REF_DOC_NO: qrmsRef,
        REASON_REV: "",
        PLANNED_REV_DATE: "",
        EXCH_RATE: "",
        POST_KEY: postKey,
        GL_ACCOUNT: line.glAccount || "",
        ZZALTACC: "",
        CUSTOMER: invoice.customer || "",
        VENDOR_NO: "",
        SP_GL_IND: "",
        PMNTTRMS: "",
        BLINE_DATE: "",
        PMNT_BLOCK: "",
        CURRENCY: invoice.currency || "",
        WRBTR: postKey === "50" ? -formatAmount(amount) : formatAmount(amount),
        DMBTR: "",
        DMBE3: "",
        TAX_CODE: line.taxCode || "",
        ALLOC_NMBR: qrmsRef,
        ITEM_TEXT: line.itemText || "",
        XREF2: "",
        TRADE_ID: line.tradingPartner || "",
        COSTCENTER: line.costCenter || "",
        FKBER: "",
        PROFIT_CTR: line.profitCenter || "",
        WBS_ELEMENT: line.wbsElement || "",
        ORDERID: "",
        PERSON_NO: "",
        QUANTITY: "",
        BASE_UOM: "",
        MATERIAL: "",
        PLANT: "",
        CROSS_COCODE:
          line.taxCode === "S3" || line.taxCode === "S4"
            ? line.crossCompanyCode || ""
            : "",
        COCO_NUM: "",
        COPA_PRCTR: line.copaProfitCenter || "",
        COPA_WW050: line.copaBRSChannel || "",
        COPA_VKORG: line.copaSalesOrganization || "",
        COPA_KMVKBU: line.copaSalesOffice || "",
        COPA_WERKS: "",
        COPA_WW110: "",
        COPA_KNDNR: line.copaCustomer || "",
        COPA_KDGRP: "",
        COPA_WW210: "",
        COPA_KUNRG: "",
        COPA_ARTNR: line.copaProduct || "",
        COPA_WW040: line.copaProductGroup || "",
        COPA_WW080: "",
        COPA_MATKL: "",
        COPA_EXTWG: "",
        COPA_WW010: "",
        COPA_WW020: "",
        COPA_WW030: "",
        COPA_WW070: "",
        COPA_WW100: "",
        COPA_AUGRU: "",
        COPA_ZZLUR: "",
        COPA_WW090: "",
      };

      rows.push(row);
    });
  });

  // Generate worksheet manually with label + technical headers
  const sheetData = [
    labelHeaders,
    technicalHeaders,
    ...rows.map((r) => technicalHeaders.map((h) => r[h] ?? "")),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  XLSX.writeFile(workbook, `QRMS_Invoice_${timestamp}.xlsx`);
}
