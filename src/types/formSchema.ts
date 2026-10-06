import { z } from "zod";

// Constructing the validation object for items within the invoice.
const itemSchema = z.object({
  name: z.string().min(1, { message: "Can't be empty" }),
  quantity: z
    .number({ invalid_type_error: "Must be a number" })
    .min(1, { message: "Min 1" }),
  price: z
    .number({ invalid_type_error: "Must be a number" })
    .positive({ message: "Must be > 0" }),
  total: z.number(),
});

// Constructing the validation object for the entire invoice form.
export const invoiceFormSchema = z.object({
  description: z.string().min(1, { message: "Can't be empty" }),
  createdAt: z.string().min(1, { message: "Date is required" }),
  currencyCode: z.string().min(1, { message: "Required" }),
  paymentTerms: z.number().or(z.string().transform((val) => Number(val))),
  clientName: z.string().min(1, { message: "Can't be empty" }),
  clientEmail: z.string().email({ message: "Invalid email address" }),
  senderAddress: z.object({
    street: z.string().min(1, { message: "Can't be empty" }),
    city: z.string().min(1, { message: "Can't be empty" }),
    postCode: z.string().min(1, { message: "Can't be empty" }),
    country: z.string().min(1, { message: "Can't be empty" }),
  }),
  clientAddress: z.object({
    street: z.string().min(1, { message: "Can't be empty" }),
    city: z.string().min(1, { message: "Can't be empty" }),
    postCode: z.string().min(1, { message: "Can't be empty" }),
    country: z.string().min(1, { message: "Can't be empty" }),
  }),
  items: z.array(itemSchema).min(1, { message: "An item must be added" }),
});

// Exporting types for the invoice form input and data based on the defined schema.
export type InvoiceFormInput = z.input<typeof invoiceFormSchema>;
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
