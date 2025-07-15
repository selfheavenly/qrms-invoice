import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserInstruction = () => {
  return (
    <DialogContent className="md:w-[80vw] md:max-w-4xl h-[80vh] overflow-y-auto sm:rounded-xl sm:p-8 bg-white shadow-xl backdrop-blur-md">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold mb-4">
          How to use the QRMS Invoice Request App
        </DialogTitle>
        <DialogDescription className="space-y-4 text-base leading-relaxed">
          <div>
            <strong>QRMS Number</strong>
            <br />
            Enter a valid QRMS Number (at least 2 characters). This will appear
            as the reference number in SAP.
          </div>

          <div>
            <strong>Invoices</strong>
            <br />
            You can add multiple invoices. Each invoice must contain:
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>
                Company Code (4 characters, must be one of the allowed codes)
              </li>
              <li>Document Type (2 characters, must be valid SAP code)</li>
              <li>Document Date</li>
              <li>Customer (numeric, at least 4 digits)</li>
              <li>Currency (3-letter code, e.g., EUR, USD)</li>
            </ul>
            <div className="mt-1">Optional: Header Text</div>
          </div>

          <div>
            <strong>Line Items</strong>
            <br />
            Each invoice must contain at least one line item. Every line must
            include:
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Amount in Document Currency (must be a positive number)</li>
              <li>Item Text (at least 2 characters)</li>
              <li>GL Account (exactly 8 digits)</li>
            </ul>
            <div className="mt-2">
              <strong>Tax Code</strong> is optional but must be 2 characters if
              filled.
            </div>
          </div>

          <div>
            <strong>Line-Level Conditional Requirements</strong>
            <br />
            <p>
              Each line must fulfill <em>at least one</em> of the following
              conditions:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>
                <strong>COPA Fields</strong> (all required except Product):
                <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                  <li>COPA - Profit Center</li>
                  <li>COPA - BRS Channel</li>
                  <li>COPA - Sales Organization</li>
                  <li>COPA - Sales Office</li>
                  <li>COPA - Customer</li>
                  <li>COPA - Product Group</li>
                  <li>
                    <em>Product</em> (optional)
                  </li>
                </ul>
              </li>
              <li>
                <strong>Rebilling Fields</strong> (Required only if Tax Code is
                S3 or S4):
                <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                  <li>Cross-Company Code</li>
                  <li>Trading Partner</li>
                </ul>
              </li>
              <li>
                <strong>Profit Center</strong> (single field)
              </li>
              <li>
                <strong>Cost Center</strong> (single field)
              </li>
              <li>
                <strong>WBS Element</strong> (single field)
              </li>
            </ul>
          </div>

          <div>
            <strong>Export</strong>
            <br />
            When you submit the form, an Excel file (.xlsx) will be downloaded
            automatically.
            <br />- Each invoice generates one <strong>summary row</strong>{" "}
            followed by its <strong>line item rows</strong>.
            <br />- The file contains fixed columns compatible with SAP's batch
            input format.
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default UserInstruction;
