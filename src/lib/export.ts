import * as XLSX from "xlsx";

export function exportToExcel(data: any) {
  const rows: any[] = [];

  // Header row - must be exactly this and in this order
  const headers = [
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

  let idCounter = 1;
  const today = new Date();
  const pstngDate = today.toISOString().split("T")[0];

  data.invoices.forEach((invoice: any, invIndex: number) => {
    invoice.lines.forEach((line: any, lineIndex: number) => {
      const row = {
        ID: idCounter++,
        LEDGER_GROUP: "",
        COMP_CODE: invoice.companyCode || "",
        DOC_DATE: invoice.documentDate || "",
        PSTNG_DATE: pstngDate,
        FIS_PERIOD: "",
        DOC_TYPE: invoice.documentType || "",
        HEADER_TXT: invoice.headerText || "",
        REF_DOC_NO: data.qrmsNumber || "",
        REASON_REV: "",
        PLANNED_REV_DATE: "",
        EXCH_RATE: "",
        POST_KEY: getPostingKey(invoice.documentType),
        GL_ACCOUNT: line.glAccount || "",
        ZZALTACC: "",
        CUSTOMER: invoice.customer || "",
        VENDOR_NO: "",
        SP_GL_IND: "",
        PMNTTRMS: "",
        BLINE_DATE: "",
        PMNT_BLOCK: "",
        CURRENCY: invoice.currency || "",
        WRBTR: line.amount || "",
        DMBTR: "",
        DMBE3: "",
        TAX_CODE: line.taxCode || "",
        ALLOC_NMBR: data.qrmsNumber || "",
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

  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

  XLSX.writeFile(workbook, `QRMS_Invoice_${Date.now()}.xlsx`);
}

// Example: Posting key logic — customize as needed
function getPostingKey(docType: string) {
  switch (docType) {
    case "DR": // Debit
      return "40";
    case "KR": // Credit memo
      return "31";
    default:
      return "40"; // Default posting key
  }
}
