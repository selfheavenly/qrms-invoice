import * as XLSX from "xlsx";

import { formatAmount, formatDate, getPostingKey } from "./utils";
import { labelHeaders, technicalHeaders } from "./fields";

export function exportToExcel(data: any) {
  const today = new Date();
  const formattedToday = formatDate(today.toISOString());

  const rows: any[] = [];

  data.invoices.forEach((invoice: any, invIndex: number) => {
    const invoiceId = invIndex + 1;
    const qrmsRef = data.qrmsNumber ? `QRMS ${data.qrmsNumber}` : "";

    // Calculate sum of amounts for the summary row
    const totalAmount = invoice.lines.reduce(
      (sum: number, line: any) => sum + Number(line.amount || 0),
      0
    );

    // Summary row - first row per invoice
    const summaryPostKey = getPostingKey(invoice.documentType, "summary");

    rows.push({
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
      POST_KEY: summaryPostKey,
      GL_ACCOUNT: "",
      ZZALTACC: "",
      CUSTOMER: invoice.customer || "",
      VENDOR_NO: "",
      SP_GL_IND: "",
      PMNTTRMS: "",
      BLINE_DATE: "",
      PMNT_BLOCK: "",
      CURRENCY: invoice.currency || "",
      WRBTR:
        summaryPostKey === "50"
          ? `-${formatAmount(totalAmount)}`
          : formatAmount(totalAmount),
      DMBTR: "",
      DMBE3: "",
      TAX_CODE: "",
      ALLOC_NMBR: qrmsRef,
      ITEM_TEXT: "",
      XREF2: "",
      TRADE_ID: "",
      COSTCENTER: "",
      FKBER: "",
      PROFIT_CTR: "",
      WBS_ELEMENT: "",
      ORDERID: "",
      PERSON_NO: "",
      QUANTITY: "",
      BASE_UOM: "",
      MATERIAL: "",
      PLANT: "",
      CROSS_COCODE: "",
      COCO_NUM: "",
      COPA_PRCTR: "",
      COPA_WW050: "",
      COPA_VKORG: "",
      COPA_KMVKBU: "",
      COPA_WERKS: "",
      COPA_WW110: "",
      COPA_KNDNR: "",
      COPA_KDGRP: "",
      COPA_WW210: "",
      COPA_KUNRG: "",
      COPA_ARTNR: "",
      COPA_WW040: "",
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
    });

    // Then normal line items (without CUSTOMER field)
    invoice.lines.forEach((line: any) => {
      const linePostKey = getPostingKey(invoice.documentType, "line");
      const amount = Number(line.amount || 0);

      rows.push({
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
        POST_KEY: linePostKey,
        GL_ACCOUNT: line.glAccount || "",
        ZZALTACC: "",
        CUSTOMER: "", // Empty for lines per your request
        VENDOR_NO: "",
        SP_GL_IND: "",
        PMNTTRMS: "",
        BLINE_DATE: "",
        PMNT_BLOCK: "",
        CURRENCY: invoice.currency || "",
        WRBTR:
          linePostKey === "50" || linePostKey === "11"
            ? `-${formatAmount(amount)}`
            : formatAmount(amount),
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
      });
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
