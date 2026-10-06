import type { Invoice } from "../../types/invoice";
import { InvoiceStatusBadge } from "../../components/InvoiceStatusBadge";
import { formatDate } from "../../services/formatters";
import { formatCurrency } from "../../services/formatters";
import { ChevronRight } from "lucide-react";

interface InvoiceCardProps {
  invoice: Invoice;
  onClick: (id: string) => void;
  currencyCode?: string; // New feature for dynamic currency selection (e.g., 'GBP', 'USD', 'EUR').
  locale?: string; // Optional property to specify the country (e.g., 'en-GB', 'en-US').
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(invoice.id)}
      className="grid grid-cols-2 md:grid-cols-5 items-center bg-white dark:bg-dark-purple p-6 rounded-lg shadow-sm border border-transparent hover:border-purple cursor-pointer transition-all duration-200 mb-4"
    >
      {/* Mobile ID and Client Name*/}
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
        <span className="font-bold text-sm text-blackText dark:text-white">
          <span className="text-grayish-blue">#</span>
          {invoice.id}
        </span>
        <span className="text-sm text-grayish-blue md:hidden">
          {invoice.clientName}
        </span>
      </div>
      {/* Date and Client Name on Desktop */}
      <div className="text-sm text-grayish-blue hidden md:block">
        Due {formatDate(invoice.paymentDue)}
      </div>
      <div className="text-sm text-dark-gray dark:text-white font-medium hidden md:block">
        {invoice.clientName}
      </div>
      {/* Date and Amount on Desktop */}
      <div className="flex flex-col items-start md:items-end justify-center md:col-span-1 gap-1 md:gap-0 mt-3 md:mt-0 mx-auto">
        <span className="text-sm text-grayish-blue md:hidden">
          Due {formatDate(invoice.paymentDue)}
        </span>
        <span className="text-base font-bold text-blackText dark:text-white md:text-lg">
          {formatCurrency(invoice.total, invoice.currencyCode)}
        </span>
      </div>
      {/* Status Badge and Arrow */}
      <div className="flex items-center justify-end md:gap-5 col-span-1 mt-3 md:mt-0">
        <InvoiceStatusBadge status={invoice.status} />
        <ChevronRight className="hidden md:block text-purple" />
      </div>
    </div>
  );
};
