import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import InvoiceTabs from "./components/InvoiceTabs";
import { exportToExcel } from "@/lib/export";
import { formSchema } from "@/lib/schema";
import { renderLabel } from "@/lib/fields";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormValues = z.infer<typeof formSchema>;

const emptyInvoice = {
  companyCode: "",
  documentType: "",
  documentDate: "",
  customer: "",
  currency: "",
  headerText: "",
  lines: [
    {
      amount: 0,
      itemText: "",
      glAccount: "",
      taxCode: "",
    },
  ],
};

export function App() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qrmsNumber: "",
      invoices: [emptyInvoice],
    },
    mode: "all",
    reValidateMode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const {
    fields: invoices,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "invoices",
  });

  const [activeTab, setActiveTab] = useState("invoice-0");

  useEffect(() => {
    if (!invoices[+activeTab.split("-")[1]]) {
      setActiveTab(`invoice-${Math.max(invoices.length - 1, 0)}`);
    }
  }, [invoices.length]);

  const handleAddInvoice = () => {
    append(emptyInvoice);
    setTimeout(() => {
      setActiveTab(`invoice-${invoices.length}`);
    }, 0);
  };

  const handleRemoveInvoice = (index: number) => {
    if (invoices.length <= 1) return;
    remove(index);
    setTimeout(() => {
      const newLength = invoices.length - 1;
      const newIndex = index >= newLength ? newLength - 1 : index;
      setActiveTab(`invoice-${newIndex}`);
    }, 0);
  };

  const onSubmit = (data: FormValues) => {
    exportToExcel(data);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-4xl font-bold text-center">QRMS Invoice Request</h1>

        <Dialog>
          <DialogTrigger asChild>
            <button
              aria-label="Instructions"
              className="text-gray-500 hover:text-gray-900 focus:outline-none"
              type="button"
            >
              <InfoCircledIcon className="h-6 w-6" />
            </button>
          </DialogTrigger>

          <DialogContent className="md:w-[80vw] md:max-w-4xl h-[80vh] overflow-y-auto sm:rounded-xl sm:p-8 bg-white shadow-xl backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-4">
                How to use the QRMS Invoice Request App
              </DialogTitle>
              <DialogDescription className="space-y-4 text-base leading-relaxed">
                <div>
                  <strong>QRMS Number</strong>
                  <br />
                  Enter a valid QRMS Number (at least 2 characters). This will
                  appear as the reference number in SAP.
                </div>

                <div>
                  <strong>Invoices</strong>
                  <br />
                  You can add multiple invoices. Each invoice must contain:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>
                      Company Code (4 characters, must be one of the allowed
                      codes)
                    </li>
                    <li>
                      Document Type (2 characters, must be valid SAP code)
                    </li>
                    <li>Document Date</li>
                    <li>Customer (numeric, at least 4 digits)</li>
                    <li>Currency (3-letter code, e.g., EUR, USD)</li>
                  </ul>
                  <div className="mt-1">Optional: Header Text</div>
                </div>

                <div>
                  <strong>Line Items</strong>
                  <br />
                  Each invoice must contain at least one line item. Every line
                  must include:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>
                      Amount in Document Currency (must be a positive number)
                    </li>
                    <li>Item Text (at least 2 characters)</li>
                    <li>GL Account (exactly 8 digits)</li>
                  </ul>
                  <div className="mt-2">
                    <strong>Tax Code</strong> is optional but must be 2
                    characters if filled.
                  </div>
                </div>

                <div>
                  <strong>Line-Level Conditional Requirements</strong>
                  <br />
                  <p>
                    Each line must fulfill <em>at least one</em> of the
                    following conditions:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>
                      <strong>COPA Fields</strong> (all required except
                      Product):
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
                      <strong>Rebilling Fields</strong> (Required only if Tax
                      Code is S3 or S4):
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
                  When you submit the form, an Excel file (.xlsx) will be
                  downloaded automatically.
                  <br />- Each invoice generates one{" "}
                  <strong>summary row</strong> followed by its{" "}
                  <strong>line item rows</strong>.
                  <br />- The file contains fixed columns compatible with SAP's
                  batch input format.
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="qrmsNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {renderLabel("qrmsNumber", "QRMS Number", "qrms")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter QRMS number"
                      {...field}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <InvoiceTabs
              invoices={invoices}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleAddInvoice={handleAddInvoice}
              handleRemoveInvoice={handleRemoveInvoice}
            />

            <Button type="submit" className="w-full text-lg">
              Export to Excel
            </Button>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}

export default App;
