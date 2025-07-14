import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceLineItems from "./InvoiceLineItems";
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
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleSelect = (index: number) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(index) ? copy.delete(index) : copy.add(index);
      return copy;
    });
  };

  const toggleExpand = (index: number) => {
    setExpandedRows((prev) => {
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
      <InvoiceHeader nestIndex={nestIndex} />
      <InvoiceLineItems
        nestIndex={nestIndex}
        lines={lines}
        selected={selected}
        expandedRows={expandedRows}
        toggleSelect={toggleSelect}
        toggleExpand={toggleExpand}
        selectAll={selectAll}
        deselectAll={deselectAll}
        deleteSelected={deleteSelected}
        duplicateSelected={duplicateSelected}
      />

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
