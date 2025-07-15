import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
import UserInstruction from "./components/UserInstruction";
import { cloneDeep } from "lodash";
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
    insert,
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

  const handleDuplicateInvoice = (index: number) => {
    const invoiceToCopy = invoices[index];
    const copiedInvoice = cloneDeep(invoiceToCopy);
    insert(index + 1, copiedInvoice);
    setTimeout(() => {
      setActiveTab(`invoice-${index + 1}`);
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
          <UserInstruction />
        </Dialog>
      </div>

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* QRMS Number */}
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
            {/* Invoice Tabs */}
            <InvoiceTabs
              invoices={invoices}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleAddInvoice={handleAddInvoice}
              handleRemoveInvoice={handleRemoveInvoice}
              handleDuplicateInvoice={handleDuplicateInvoice}
            />
            {/* Submit Button (Export to Excel) */}
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
