import { useState } from "react";
import { InvoicesHeader } from "./InvoicesHeader";
import { InvoiceCard } from "./InvoiceCard";
import { useGetInvoices } from "../../hooks/useInvoices";
import type { InvoiceStatus } from "../../types/invoice";
import { InvoiceFormDrawer } from "./InvoiceFormDrawer";
import { useNavigate } from "react-router";

export const InvoicesDashboard: React.FC = () => {
  const { data: invoices = [], isLoading, isError } = useGetInvoices();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | "all">(
    "all",
  );
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  const filteredInvoices =
    filterStatus === "all"
      ? invoices
      : invoices.filter((inv) => inv.status === filterStatus);

  const handleInvoiceClick = (id: string) => {
    navigate(`/invoice/${id}`);
  };

  const handleNewInvoiceClick = () => {
    setIsNewInvoiceOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-custom py-10 font-bold">
        Error loading invoices. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <InvoicesHeader
        totalCount={filteredInvoices.length}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onNewInvoiceClick={handleNewInvoiceClick}
      />
      {/* Invoice Cards */}
      <div className="mt-4">
        {filteredInvoices.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-dark-purple rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2">There is nothing here</h3>
            <p className="text-grayish-blue max-w-xs text-sm">
              Create an invoice by clicking the{" "}
              <span className="font-bold">New Invoice</span> button and get
              started.
            </p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onClick={handleInvoiceClick}
            />
          ))
        )}
      </div>

      <InvoiceFormDrawer
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
      />
    </div>
  );
};
