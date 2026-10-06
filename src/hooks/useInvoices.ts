import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceService } from "../services/invoiceService";
import type { Invoice } from "../types/invoice";
import { initialInvoices } from "../utils/mockData";

// Get all invoices
export const useGetInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      let data = await invoiceService.getAllInvoices();
      // If there are no invoices in localStorage, initialize it with mock data
      if (data.length === 0) {
        localStorage.setItem(
          "invoice_app_data",
          JSON.stringify(initialInvoices),
        );
        data = initialInvoices;
      }
      return data;
    },
  });
};

// Get a single invoice by ID
export const useInvoiceById = (id: string) => {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: () => invoiceService.getInvoiceById(id),
    enabled: !!id,
  });
};

// Create a new invoice
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newInvoice: Invoice) =>
      invoiceService.createInvoice(newInvoice),
    onSuccess: () => {
      // Clear the cache and refetch invoices automatically to update the UI immediately.
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// Update an existing invoice
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedInvoice: Invoice) =>
      invoiceService.updateInvoice(updatedInvoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// Delete an invoice
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invoiceService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};
