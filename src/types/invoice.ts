export type InvoiceStatus = "paid" | "pending" | "draft";

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface InvoiceItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  currencyCode: string;
  description: string;
  paymentTerms: number;
  status: InvoiceStatus;
  clientName: string;
  clientEmail: string;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
}
