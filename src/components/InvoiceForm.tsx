import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
// Import the reusable label render function
import { renderLabel } from "@/lib/fields";
import { useState } from "react";

type Props = {
  nestIndex: number;
};

export default function InvoiceForm({ nestIndex }: Props) {
  const { control } = useFormContext();
  const {
    fields: lines,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `invoices.${nestIndex}.lines`,
  });

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleSelect = (index: number) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(index) ? copy.delete(index) : copy.add(index);
      return copy;
    });
  };

  const selectAll = () => setSelected(new Set(lines.map((_, i) => i)));

  const deselectAll = () => setSelected(new Set());

  const deleteSelected = () => {
    const toRemove = Array.from(selected).sort((a, b) => b - a);
    toRemove.forEach((i) => remove(i));
    deselectAll();
  };

  const duplicateSelected = () => {
    Array.from(selected).forEach((index) => {
      const line = lines[index];
      append({ ...line });
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name={`invoices.${nestIndex}.companyCode`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {renderLabel("companyCode", "Company Code", "invoice")}
              </FormLabel>
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
              <FormLabel>
                {renderLabel("documentType", "Document Type", "invoice")}
              </FormLabel>
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
              <FormLabel>
                {renderLabel("documentDate", "Document Date", "invoice")}
              </FormLabel>
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
              <FormLabel>
                {renderLabel("customer", "Customer", "invoice")}
              </FormLabel>
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
              <FormLabel>
                {renderLabel("currency", "Currency", "invoice")}
              </FormLabel>
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
              <FormLabel>
                {renderLabel("headerText", "Header Text", "invoice")}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Line Items</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAll}
              disabled={lines.length === 0}
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={deselectAll}
              disabled={selected.size === 0}
            >
              Deselect All
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteSelected}
              disabled={selected.size === 0}
            >
              Delete Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={duplicateSelected}
              disabled={selected.size === 0}
            >
              Duplicate Selected
            </Button>
          </div>
        </div>

        {lines.map((line, index) => (
          <div
            key={line.id}
            className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-4 items-end"
          >
            <Checkbox
              checked={selected.has(index)}
              onCheckedChange={() => toggleSelect(index)}
              className="mt-2"
            />

            <FormField
              control={control}
              name={`invoices.${nestIndex}.lines.${index}.amount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {renderLabel("amount", "Amount", "line")}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`invoices.${nestIndex}.lines.${index}.itemText`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {renderLabel("itemText", "Item Text", "line")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`invoices.${nestIndex}.lines.${index}.glAccount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {renderLabel("glAccount", "GL Account", "line")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`invoices.${nestIndex}.lines.${index}.taxCode`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {renderLabel("taxCode", "Tax Code", "line")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={() =>
          append({ amount: 0, itemText: "", glAccount: "", taxCode: "" })
        }
        className="w-full"
        variant="outline"
      >
        + Add Line Item
      </Button>
    </div>
  );
}
