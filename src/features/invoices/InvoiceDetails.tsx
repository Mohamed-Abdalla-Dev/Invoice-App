import { useParams, useNavigate, Link } from "react-router";
import {
  useInvoiceById,
  useDeleteInvoice,
  useUpdateInvoice,
} from "../../hooks/useInvoices";
import { InvoiceStatusBadge } from "../../components/InvoiceStatusBadge";
import { CustomButton } from "../../components/CustomButton";
import type { Invoice } from "../../types/invoice";
import { formatDate, formatCurrency } from "../../services/formatters";
import { InvoiceFormDrawer } from "./InvoiceFormDrawer";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const queryClient = useInvoiceById(id || "");

  const deleteMutation = useDeleteInvoice();
  const updateMutation = useUpdateInvoice();

  // Searching for the specific invoice within the retrieved data.
  const invoice = queryClient.data;

  if (queryClient.isLoading) {
    return (
      <div className="text-center py-20 font-bold text-purple">
        Loading invoice details...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-4">Invoice not found</h2>
        <Link to="/" className="text-purple font-bold hover:underline">
          Go back to dashboard
        </Link>
      </div>
    );
  }

  // The deletion process.
  const handleDelete = async () => {
    if (
      window.confirm(`Are you sure you want to delete invoice #${invoice.id}?`)
    ) {
      await deleteMutation.mutateAsync(invoice.id);
      navigate("/"); // Redirecting to the main dashboard after deletion.
    }
  };

  // The process to mark the invoice as paid.
  const handleMarkAsPaid = async () => {
    if (!invoice) return;

    // Building the new invoice object with the status updated to paid
    const updatedInvoice: Invoice = {
      ...invoice,
      status: "paid",
    };

    try {
      // Execute the update process and wait for the result.
      await updateMutation.mutateAsync(updatedInvoice);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn">
      <Link
        to="/"
        className="flex items-center gap-6 font-bold text-sm mb-8 text-blackText dark:text-white hover:text-grayish-blue transition-colors group"
      >
        <ChevronLeft className="text-purple" />
        <span>Go back</span>
      </Link>

      <div className="flex items-center justify-between bg-white dark:bg-dark-purple p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between w-full md:w-auto md:gap-5">
          <span className="text-sm text-grayish-blue font-medium">Status</span>
          <InvoiceStatusBadge status={invoice.status} />
        </div>
        {/* The three desktop control buttons */}
        <div className="hidden md:flex items-center gap-2">
          <CustomButton
            variant="secondary"
            onClick={() => setIsEditDrawerOpen(true)}
          >
            Edit
          </CustomButton>
          <CustomButton
            variant="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </CustomButton>
          {invoice.status !== "paid" && (
            <CustomButton
              variant="primary"
              onClick={handleMarkAsPaid}
              disabled={updateMutation.isPending}
            >
              Mark as Paid
            </CustomButton>
          )}
        </div>
      </div>
      {/* Main Invoice Details Box*/}
      <div className="bg-white dark:bg-dark-purple p-6 md:p-12 rounded-lg shadow-sm flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-0">
          <div>
            <h2 className="font-bold text-base md:text-xl text-blackText dark:text-white">
              <span className="text-grayish-blue">#</span>
              {invoice.id}
            </h2>
            <p className="text-sm text-grayish-blue mt-1">
              {invoice.description}
            </p>
          </div>
          <div className="text-xs md:text-sm text-grayish-blue md:text-right leading-relaxed">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-sm text-grayish-blue block mb-2">
                Invoice Date
              </span>
              <span className="font-bold text-base text-blackText dark:text-white">
                {formatDate(invoice.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-sm text-grayish-blue block mb-2">
                Payment Due
              </span>
              <span className="font-bold text-base text-blackText dark:text-white">
                {formatDate(invoice.paymentDue)}
              </span>
            </div>
          </div>

          <div>
            <span className="text-sm text-grayish-blue block mb-2">
              Bill To
            </span>
            <span className="font-bold text-base text-blackText dark:text-white block mb-3">
              {invoice.clientName}
            </span>
            <div className="text-xs md:text-sm text-grayish-blue leading-relaxed">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <span className="text-sm text-grayish-blue block mb-2">
              Sent to
            </span>
            <span className="font-bold text-base md:text-lg text-blackText dark:text-white break-all">
              {invoice.clientEmail}
            </span>
          </div>
        </div>
        {/*Items Table Box*/}
        <div className="rounded-lg overflow-hidden mt-6">
          <div className="bg-light-bg dark:bg-[#252945] p-6 md:p-8 flex flex-col gap-6">
            {/* Header for large screens*/}
            <div className="hidden md:grid grid-cols-5 text-sm text-grayish-blue font-medium">
              <span className="col-span-2">Item Name</span>
              <span className="text-center">QTY.</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>
            {/* Real-element iteration loop*/}
            {invoice.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="grid grid-cols-2 md:grid-cols-5 items-center justify-between max-md:flex text-sm font-bold text-blackText dark:text-white"
              >
                <div className="col-span-2 flex flex-col gap-1 md:gap-0">
                  <span>{item.name}</span>
                  <span className="text-grayish-blue md:hidden text-xs">
                    {item.quantity} x{" "}
                    {formatCurrency(item.price, invoice.currencyCode)}
                  </span>
                </div>
                <span className="hidden md:block text-center text-grayish-blue">
                  {item.quantity}
                </span>
                <span className="hidden md:block text-right text-grayish-blue">
                  {formatCurrency(item.price, invoice.currencyCode)}
                </span>
                <span className="text-right">
                  {formatCurrency(item.total, invoice.currencyCode)}
                </span>
              </div>
            ))}
          </div>
          {/* Grand Total Footer */}
          <div className="bg-[#373B53] dark:bg-blackText p-6 md:p-8 flex items-center justify-between text-white rounded-b-lg">
            <span className="text-sm font-medium">Amount Due</span>
            <span className="text-xl md:text-3xl font-bold">
              {formatCurrency(invoice.total, invoice.currencyCode)}
            </span>
          </div>
        </div>
      </div>
      {/* Mobile Control Buttons*/}
      <div className="flex md:hidden items-center justify-center gap-2 bg-white dark:bg-dark-purple p-4 mt-6 rounded-lg shadow-sm">
        <CustomButton
          variant="secondary"
          onClick={() => setIsEditDrawerOpen(true)}
        >
          Edit
        </CustomButton>
        <CustomButton variant="danger" onClick={handleDelete}>
          Delete
        </CustomButton>
        {invoice.status !== "paid" && (
          <CustomButton variant="primary" onClick={handleMarkAsPaid}>
            Paid
          </CustomButton>
        )}
      </div>
      <InvoiceFormDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        invoiceToEdit={invoice}
      />
    </div>
  );
};
