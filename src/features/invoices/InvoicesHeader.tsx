import { useState } from "react";
import { CustomButton } from "../../components/CustomButton";
import type { InvoiceStatus } from "../../types/invoice";
import { ChevronDown } from "lucide-react";

interface InvoicesHeaderProps {
  totalCount: number;
  filterStatus: InvoiceStatus | "all";
  onFilterChange: (status: InvoiceStatus | "all") => void;
  onNewInvoiceClick: () => void;
}

export const InvoicesHeader: React.FC<InvoicesHeaderProps> = ({
  totalCount,
  filterStatus,
  onFilterChange,
  onNewInvoiceClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const statuses: (InvoiceStatus | "all")[] = [
    "all",
    "draft",
    "pending",
    "paid",
  ];

  return (
    <header className="flex items-center justify-between mb-8 md:mb-14">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-4xl text-blackText dark:text-white">
          Invoices
        </h1>
        <p className="text-sm text-grayish-blue mt-1">
          {totalCount === 0
            ? "No invoices"
            : `There are ${totalCount} total invoices`}
        </p>
      </div>

      <div className="flex items-center gap-5 md:gap-10">
        {/* Custom Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 font-bold text-sm text-blackText dark:text-white cursor-pointer select-none"
          >
            <span>
              Filter <span className="hidden md:inline">by status</span>
            </span>
            <ChevronDown
              className={`text-purple transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 w-40 bg-white dark:bg-dark-purple p-6 rounded-lg shadow-xl flex flex-col gap-4">
              {statuses.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-3 font-bold text-sm text-blackText dark:text-white cursor-pointer group capitalize"
                >
                  <input
                    type="checkbox"
                    checked={filterStatus === status}
                    onChange={() => {
                      onFilterChange(status);
                      setIsDropdownOpen(false);
                    }}
                    className="w-4 h-4 rounded border-transparent bg-light-bg dark:bg-very-dark-blue checked:bg-purple text-purple focus:ring-0 cursor-pointer accent-purple"
                  />
                  <span className="group-hover:text-purple transition-colors duration-150">
                    {status === "all" ? "All" : status}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* New Invoice Button */}
        <CustomButton
          variant="primary"
          hasIcon={true}
          onClick={onNewInvoiceClick}
        >
          New <span className="hidden md:inline md:ml-1"> Invoice</span>
        </CustomButton>
      </div>
    </header>
  );
};
