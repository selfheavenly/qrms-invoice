import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import InvoiceForm from "@/components/InvoiceForm";

type InvoiceTabsProps = {
  invoices: any[];
  activeTab: string;
  setActiveTab: (val: string) => void;
  handleAddInvoice: () => void;
  handleRemoveInvoice: (index: number) => void;
  handleDuplicateInvoice: (index: number) => void; // <-- Add this in parent
};

export default function InvoiceTabs({
  invoices,
  activeTab,
  setActiveTab,
  handleAddInvoice,
  handleRemoveInvoice,
  handleDuplicateInvoice,
}: InvoiceTabsProps) {
  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeTabElement = document.querySelector(`[data-state="active"]`);
    if (activeTabElement) {
      activeTabElement.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [activeTab]);

  const scrollTabs = (direction: "left" | "right") => {
    if (!tabsListRef.current) return;
    const scrollAmount = 128;
    tabsListRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          if (val !== "new") setActiveTab(val);
        }}
        className="w-full"
      >
        <div className="relative w-full border border-gray-200 rounded-md bg-white shadow-sm">
          {/* Left scroll */}
          <button
            type="button"
            aria-label="Scroll Left"
            onClick={() => scrollTabs("left")}
            className="absolute left-0 top-0 bottom-0 z-30 flex items-center justify-center w-8 bg-white border-r border-gray-200 hover:bg-gray-100 disabled:opacity-50 rounded-l-md"
            disabled={
              !tabsListRef.current || tabsListRef.current.scrollLeft === 0
            }
          >
            ‹
          </button>

          {/* Right scroll */}
          <button
            type="button"
            aria-label="Scroll Right"
            onClick={() => scrollTabs("right")}
            className="absolute right-0 top-0 bottom-0 z-30 flex items-center justify-center w-8 bg-white border-l border-gray-200 hover:bg-gray-100 disabled:opacity-50 rounded-r-md"
            disabled={
              !tabsListRef.current ||
              tabsListRef.current.scrollWidth -
                tabsListRef.current.clientWidth ===
                tabsListRef.current.scrollLeft
            }
          >
            ›
          </button>

          <div
            ref={tabsListRef}
            className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 no-scrollbar-touch px-8"
            style={{
              scrollBehavior: "smooth",
              scrollPaddingInline: "50px",
              paddingBottom: "12px",
              marginBottom: "-12px",
            }}
          >
            <TabsList className="flex bg-white p-0">
              {invoices.map((_, index) => (
                <TabsTrigger
                  key={index}
                  value={`invoice-${index}`}
                  className="flex-shrink-0 w-32 text-center text-sm font-medium transition
                             data-[state=active]:bg-gray-200 data-[state=active]:text-black data-[state=active]:shadow
                             data-[state=inactive]:text-gray-700 rounded-sm"
                >
                  Invoice {index + 1}
                </TabsTrigger>
              ))}

              <button
                type="button"
                onClick={handleAddInvoice}
                className="flex-shrink-0 w-32 inline-flex items-center justify-center text-sm font-medium py-1 text-blue-600
                           hover:text-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-sm"
              >
                + New Invoice
              </button>
            </TabsList>
          </div>
        </div>

        {invoices.map((_, index) => (
          <TabsContent
            key={index}
            value={`invoice-${index}`}
            className="mt-4 border p-6 shadow-sm bg-white max-h-[75vh] overflow-y-auto w-full rounded-md border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Invoice {index + 1}</h2>
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDuplicateInvoice(index)}
                >
                  Duplicate
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={invoices.length === 1}
                  onClick={() => handleRemoveInvoice(index)}
                >
                  Remove
                </Button>
              </div>
            </div>

            <InvoiceForm nestIndex={index} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
