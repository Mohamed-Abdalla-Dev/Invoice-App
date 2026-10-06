import type { InvoiceStatus } from "../types/invoice";

interface StatusBadgeProps {
  status: InvoiceStatus;
}

export const InvoiceStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Defining the different patterns for each invoice status.
  const statusStyles = {
    paid: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/5",
      text: "text-emerald-500",
      dot: "bg-emerald-500",
      label: "Paid",
    },
    pending: {
      bg: "bg-amber-500/10 dark:bg-amber-500/5",
      text: "text-amber-500",
      dot: "bg-amber-500",
      label: "Pending",
    },
    draft: {
      bg: "bg-slate-500/10 dark:bg-slate-300/10",
      text: "text-slate-600 dark:text-slate-300",
      dot: "bg-slate-600 dark:bg-slate-300",
      label: "Draft",
    },
  };

  const currentStyle = statusStyles[status];

  return (
    <div
      className={`flex items-center justify-center w-28 h-10 rounded-md font-bold text-sm tracking-wide capitalize ${currentStyle.bg} ${currentStyle.text}`}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${currentStyle.dot}`} />
      {currentStyle.label}
    </div>
  );
};
