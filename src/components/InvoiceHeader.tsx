import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  allowedCompanyCodes,
  allowedCurrencies,
  allowedDocumentTypes,
} from "@/lib/schema";

import { ComboboxInput } from "@/components/ComboboxInput"; // ✅ new
import { Input } from "@/components/ui/input";
import { renderLabel } from "@/lib/fields";
import { useFormContext } from "react-hook-form";

// ✅ import

type Props = {
  nestIndex: number;
};

const InvoiceHeader = ({ nestIndex }: Props) => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-start">
      <FormField
        control={control}
        name={`invoices.${nestIndex}.companyCode`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {renderLabel("companyCode", "Company Code", "invoice")}
            </FormLabel>
            <FormControl>
              <ComboboxInput
                value={field.value}
                onChange={field.onChange}
                options={allowedCompanyCodes}
              />
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
              <ComboboxInput
                value={field.value}
                onChange={field.onChange}
                options={allowedDocumentTypes}
              />
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
              <ComboboxInput
                value={field.value}
                onChange={field.onChange}
                options={allowedCurrencies}
              />
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
  );
};

export default InvoiceHeader;
