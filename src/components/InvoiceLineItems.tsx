import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { renderLabel } from "@/lib/fields";
import { useFormContext } from "react-hook-form";

type Props = {
  nestIndex: number;
  lines: any[];
  selected: Set<number>;
  expandedRows: Set<number>;
  toggleSelect: (index: number) => void;
  toggleExpand: (index: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
};

const InvoiceLineItems = ({
  nestIndex,
  lines,
  selected,
  expandedRows,
  toggleSelect,
  toggleExpand,
  selectAll,
  deselectAll,
  deleteSelected,
  duplicateSelected,
}: Props) => {
  const { control } = useFormContext();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Line Items</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={selectAll}
            disabled={lines.length === 0}
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={deselectAll}
            disabled={selected.size === 0}
          >
            Deselect All
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={deleteSelected}
            disabled={selected.size === 0}
          >
            Delete Selected
          </Button>
          <Button
            type="button"
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
        <div key={line.id} className="border border-gray-200 rounded-md p-3">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-4 items-start">
            <Checkbox
              checked={selected.has(index)}
              onCheckedChange={() => toggleSelect(index)}
              className="mt-8"
            />

            <FormField
              control={control}
              name={`invoices.${nestIndex}.lines.${index}.amount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {renderLabel("amount", "Gross Amount (brutto)", "line")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value)
                        )
                      }
                    />
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

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="self-center"
              onClick={() => toggleExpand(index)}
            >
              {expandedRows.has(index) ? "Hide Details" : "Show Details"}
            </Button>
          </div>

          {expandedRows.has(index) && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 border-t pt-4">
              {/* COPA Fields */}
              <FormField
                control={control}
                name={`invoices.${nestIndex}.lines.${index}.copaProfitCenter`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabel(
                        "copaProfitCenter",
                        "COPA Profit Center",
                        "line"
                      )}
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
                name={`invoices.${nestIndex}.lines.${index}.copaBRSChannel`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabel(
                        "copaBRSChannel",
                        "COPA BRS Channel",
                        "line"
                      )}
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
                name={`invoices.${nestIndex}.lines.${index}.copaSalesOrganization`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabel(
                        "copaSalesOrganization",
                        "COPA Sales Organization",
                        "line"
                      )}
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
                name={`invoices.${nestIndex}.lines.${index}.copaSalesOffice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabel(
                        "copaSalesOffice",
                        "COPA Sales Office",
                        "line"
                      )}
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
                name={`invoices.${nestIndex}.lines.${index}.copaCustomer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabel("copaCustomer", "COPA Customer", "line")}
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
                name={`invoices.${nestIndex}.lines.${index}.copaProductGroup`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabel(
                        "copaProductGroup",
                        "COPA Product Group",
                        "line"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rebilling Fields */}
              <FormField
                control={control}
                name={`invoices.${nestIndex}.lines.${index}.crossCompanyCode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabel(
                        "crossCompanyCode",
                        "Cross Company Code",
                        "line"
                      )}
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
                name={`invoices.${nestIndex}.lines.${index}.tradingPartner`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabel("tradingPartner", "Trading Partner", "line")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cost Center / Profit Center / WBS Element */}
              <FormField
                control={control}
                name={`invoices.${nestIndex}.lines.${index}.profitCenter`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabel("profitCenter", "Profit Center", "line")}
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
                name={`invoices.${nestIndex}.lines.${index}.costCenter`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabel("costCenter", "Cost Center", "line")}
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
                name={`invoices.${nestIndex}.lines.${index}.wbsElement`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabel("wbsElement", "WBS Element", "line")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InvoiceLineItems;
