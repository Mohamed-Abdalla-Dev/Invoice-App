import type { Invoice } from "../types/invoice";
import { initialInvoices } from "../utils/mockData";

const LOCAL_STORAGE_KEY = "invoices-app-data";

// A helper function to fetch current data from the browser.
const getStoredInvoices = (): Invoice[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialInvoices));
    return initialInvoices;
  }
  return JSON.parse(data);
};

// A helper function to save data to the browser.
const saveToStorage = (invoices: Invoice[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(invoices));
};

export const invoiceService = {
  // Get All Invoices.
  getAllInvoices: async (): Promise<Invoice[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredInvoices());
      }, 500); // Simulate a delay of 500ms to mimic an API call.
    });
  },

  // Get Invoice by ID.
  getInvoiceById: async (id: string): Promise<Invoice | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invoices = getStoredInvoices();
        const invoice = invoices.find((inv) => inv.id === id);
        resolve(invoice);
      }, 500);
    });
  },

  // Create a new invoice.
  createInvoice: async (newInvoice: Invoice): Promise<Invoice> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invoices = getStoredInvoices();
        invoices.push(newInvoice);
        saveToStorage(invoices);
        resolve(newInvoice);
      }, 500);
    });
  },

  // Update an existing invoice
  updateInvoice: async (updatedInvoice: Invoice): Promise<Invoice> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const invoices = getStoredInvoices();

        const index = invoices.findIndex((inv) => inv.id === updatedInvoice.id);

        if (index !== -1) {
          invoices[index] = updatedInvoice;
          // Save the updated array back to localStorage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(invoices));
          resolve(updatedInvoice);
        } else {
          reject(new Error("Invoice not found in local storage"));
        }
      }, 500);
    });
  },

  // Delete an invoice
  deleteInvoice: async (id: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const invoices = getStoredInvoices();
        const filtered = invoices.filter((inv) => inv.id !== id);

        if (invoices.length !== filtered.length) {
          saveToStorage(filtered);
          resolve(id);
        } else {
          reject(new Error("Invoice not found"));
        }
      }, 500);
    });
  },
};
