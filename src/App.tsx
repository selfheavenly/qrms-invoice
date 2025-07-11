import "./index.css";

import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InvoiceForm from "@/components/InvoiceForm";
import React from "react";
import { exportToExcel } from "@/lib/export";
import { formSchema } from "@/lib/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormValues = z.infer<typeof formSchema>;

export function App() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qrmsNumber: "",
      invoices: [],
    },
  });

  const {
    fields: invoices,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "invoices",
  });

  const onSubmit = (data: FormValues) => {
    exportToExcel(data);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        QRMS Invoice Request
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* QRMS Number Field */}
          <FormField
            control={form.control}
            name="qrmsNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>QRMS Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter QRMS number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Invoices Section */}
          <div>
            <Button
              type="button"
              onClick={() =>
                append({
                  companyCode: "",
                  documentType: "",
                  documentDate: "",
                  customer: "",
                  currency: "",
                  headerText: "",
                  lines: [],
                })
              }
              variant="outline"
              className="mb-4"
            >
              + Add Invoice
            </Button>

            {invoices.length === 0 && (
              <p className="text-muted-foreground">
                No invoices added yet. Click above to add one.
              </p>
            )}

            <FormProvider {...form}>
              {invoices.map((invoice, index) => (
                <Card key={invoice.id} className="mb-6 border">
                  <CardContent>
                    <InvoiceForm nestIndex={index} />

                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-2 text-red-600 hover:text-red-800"
                      onClick={() => remove(index)}
                    >
                      Remove Invoice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </FormProvider>
          </div>

          <Button type="submit" className="w-full text-lg">
            Export Excel
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default App;
