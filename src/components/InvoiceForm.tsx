import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

type Props = {
  nestIndex: number;
};

export default function InvoiceForm({ nestIndex }: Props) {
  const { control } = useFormContext();
  const { fields: lines, append } = useFieldArray({
    control,
    name: `invoices.${nestIndex}.lines`,
  });

  return (
    <div className="mb-8 rounded border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Invoice {nestIndex + 1}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <FormField
          control={control}
          name={`invoices.${nestIndex}.companyCode`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`invoices.${nestIndex}.documentType`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`invoices.${nestIndex}.documentDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`invoices.${nestIndex}.customer`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`invoices.${nestIndex}.currency`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`invoices.${nestIndex}.headerText`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Header Text (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <h3 className="text-lg font-medium mb-2">Line Items</h3>

      {lines.map((line, lineIndex) => (
        <div
          key={line.id}
          className="grid grid-cols-1 md:grid-cols-4 items-end gap-4 mb-4"
        >
          <FormField
            control={control}
            name={`invoices.${nestIndex}.lines.${lineIndex}.amount`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`invoices.${nestIndex}.lines.${lineIndex}.itemText`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Text</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`invoices.${nestIndex}.lines.${lineIndex}.glAccount`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>GL Account</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`invoices.${nestIndex}.lines.${lineIndex}.taxCode`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}

      <Button
        type="button"
        onClick={() =>
          append({ amount: 0, itemText: "", glAccount: "", taxCode: "" })
        }
        variant="outline"
      >
        + Add Line Item
      </Button>
    </div>
  );
}
