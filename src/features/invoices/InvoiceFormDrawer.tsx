import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  invoiceFormSchema,
  type InvoiceFormInput,
  type InvoiceFormData,
} from "../../types/formSchema";
import { InputField } from "../../components/InputField";
import { CustomButton } from "../../components/CustomButton";
import { useCreateInvoice, useUpdateInvoice } from "../../hooks/useInvoices";
import type { Invoice } from "../../types/invoice";
import { Trash } from "lucide-react";

interface InvoiceFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceToEdit?: Invoice;
}
export const InvoiceFormDrawer: React.FC<InvoiceFormDrawerProps> = ({
  isOpen,
  onClose,
  invoiceToEdit,
}) => {
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();
  const isEditMode = !!invoiceToEdit;

  // Setting up react-hook-form with zod validation and default values for the form.
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormInput, unknown, InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      createdAt: new Date().toISOString().split("T")[0],
      currencyCode: "GBP",
      paymentTerms: 30,
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  // Resetting the form values when the drawer opens or when switching between edit and create modes.
  useEffect(() => {
    if (isEditMode && invoiceToEdit) {
      reset({
        description: invoiceToEdit.description,
        createdAt: invoiceToEdit.createdAt,
        paymentTerms: invoiceToEdit.paymentTerms,
        clientName: invoiceToEdit.clientName,
        clientEmail: invoiceToEdit.clientEmail,
        senderAddress: invoiceToEdit.senderAddress,
        clientAddress: invoiceToEdit.clientAddress,
        items: invoiceToEdit.items,
      });
    } else {
      reset({
        description: "",
        createdAt: new Date().toISOString().split("T")[0],
        paymentTerms: 30,
        clientName: "",
        clientEmail: "",
        senderAddress: { street: "", city: "", postCode: "", country: "" },
        clientAddress: { street: "", city: "", postCode: "", country: "" },
        items: [],
      });
    }
  }, [isEditMode, invoiceToEdit, reset, isOpen]);

  // Function to generate a unique invoice ID based on the current invoices.
  const generateInvoiceId = (currentInvoices: Invoice[]): string => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    const randomLetters =
      letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)];

    let randomNumbers = "";
    for (let i = 0; i < 4; i++) {
      randomNumbers += numbers[Math.floor(Math.random() * 10)];
    }

    const newId = randomLetters + randomNumbers;

    const isDuplicate = currentInvoices.some((invoice) => invoice.id === newId);

    return isDuplicate ? generateInvoiceId(currentInvoices) : newId;
  };

  // Function to handle form submission for creating or updating an invoice.
  const onSubmitForm = async (data: InvoiceFormData) => {
    const calculatedItems = data.items.map((item) => ({
      ...item,
      total: Number((item.quantity * item.price).toFixed(2)),
    }));
    const grandTotal = calculatedItems.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    const creationDate = new Date(data.createdAt);
    creationDate.setDate(creationDate.getDate() + Number(data.paymentTerms));
    const paymentDue = creationDate.toISOString().split("T")[0];

    if (isEditMode && invoiceToEdit) {
      const updatedInvoice: Invoice = {
        ...invoiceToEdit,
        ...data,
        items: calculatedItems,
        total: grandTotal,
        paymentDue,
      };
      await updateMutation.mutateAsync(updatedInvoice);
    } else {
      const newInvoice: Invoice = {
        id: generateInvoiceId([]),
        status: "pending",
        ...data,
        items: calculatedItems,
        total: grandTotal,
        paymentDue,
      };
      await createMutation.mutateAsync(newInvoice);
    }
    onClose();
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`relative w-full max-w-2xl bg-white dark:bg-very-dark-blue h-full shadow-2xl p-6 md:p-14 overflow-y-auto flex flex-col justify-between transition-transform duration-300 ease-out lg:pl-36 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="flex flex-col gap-8 h-full justify-between"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-blackText dark:text-white mb-6">
              {isEditMode ? `Edit #${invoiceToEdit.id}` : "Create Invoice"}
            </h2>
            {/* Bill From */}
            <div className="flex flex-col gap-4 mb-6">
              <span className="text-xs font-bold text-purple">Bill From</span>
              <InputField
                label="Street Address"
                register={register("senderAddress.street")}
                error={errors.senderAddress?.street?.message}
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InputField
                  label="City"
                  register={register("senderAddress.city")}
                  error={errors.senderAddress?.city?.message}
                />
                <InputField
                  label="Post Code"
                  register={register("senderAddress.postCode")}
                  error={errors.senderAddress?.postCode?.message}
                />
                <InputField
                  label="Country"
                  register={register("senderAddress.country")}
                  className="col-span-2 md:col-span-1"
                />
              </div>
            </div>

            {/* Bill To */}
            <div className="flex flex-col gap-4 mb-6">
              <span className="text-xs font-bold text-purple">Bill To</span>
              <InputField
                label="Client's Name"
                register={register("clientName")}
                error={errors.clientName?.message}
              />
              <InputField
                label="Client's Email"
                register={register("clientEmail")}
                error={errors.clientEmail?.message}
                placeholder="e.g. alex@mail.com"
              />
              <InputField
                label="Street Address"
                register={register("clientAddress.street")}
                error={errors.clientAddress?.street?.message}
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InputField
                  label="City"
                  register={register("clientAddress.city")}
                  error={errors.clientAddress?.city?.message}
                />
                <InputField
                  label="Post Code"
                  register={register("clientAddress.postCode")}
                  error={errors.clientAddress?.postCode?.message}
                />
                <InputField
                  label="Country"
                  register={register("clientAddress.country")}
                  className="col-span-2 md:col-span-1"
                />
              </div>
            </div>

            {/* Dates & Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <InputField
                label="Invoice Date"
                type="date"
                register={register("createdAt")}
                error={errors.createdAt?.message}
                disabled={isEditMode}
              />
              <div className="flex flex-col gap-2 w-full">
                <label className="text-xs font-medium text-grayish-blue dark:text-slate-300">
                  Payment Terms
                </label>
                <select
                  {...register("paymentTerms")}
                  className="w-full h-12 px-5 rounded border border-slate-200 dark:border-[#252945] bg-white dark:bg-dark-purple font-bold text-sm text-blackText dark:text-white outline-none focus:border-purple"
                >
                  <option value={1}>Net 1 Day</option>
                  <option value={7}>Net 7 Days</option>
                  <option value={14}>Net 14 Days</option>
                  <option value={30}>Net 30 Days</option>
                </select>
              </div>
              {/* Currency Selection */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-xs font-medium text-grayish-blue dark:text-slate-300">
                  Currency
                </label>
                <select
                  {...register("currencyCode")}
                  className="w-full h-12 px-5 rounded border border-slate-200 dark:border-[#252945] bg-white dark:bg-dark-purple font-bold text-sm text-blackText dark:text-white outline-none focus:border-purple cursor-pointer"
                >
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="SAR">SAR (ر.س)</option>
                  <option value="EGP">EGP (ج.م)</option>
                  <option value="SDG">SDG (ج.س)</option>
                </select>
              </div>
            </div>
            <InputField
              label="Project Description"
              register={register("description")}
              error={errors.description?.message}
              placeholder="e.g. Website Design"
              className="mb-8"
            />

            {/* Item List */}
            <div className="flex flex-col gap-4 mb-6">
              <h3 className="text-sm font-bold text-[#777F98] tracking-wide">
                Item List
              </h3>
              {errors.items && (
                <p className="text-red-custom text-xs font-semibold">
                  {errors.items.message}
                </p>
              )}
              {/* Item Fields */}
              <div className="flex flex-col gap-4">
                {fields.map((field, index) => {
                  const qty = watchedItems?.[index]?.quantity || 0;
                  const price = watchedItems?.[index]?.price || 0;
                  const totalAmount = (qty * price).toFixed(2);

                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-3 items-end max-md:flex max-md:flex-wrap"
                    >
                      <div className="col-span-5">
                        <InputField
                          label="Item Name"
                          register={register(`items.${index}.name` as const)}
                          error={errors.items?.[index]?.name?.message}
                        />
                      </div>
                      <div className="col-span-2">
                        <InputField
                          label="Qty."
                          type="number"
                          register={register(
                            `items.${index}.quantity` as const,
                            { valueAsNumber: true },
                          )}
                          error={errors.items?.[index]?.quantity?.message}
                        />
                      </div>
                      <div className="col-span-3">
                        <InputField
                          label="Price"
                          type="number"
                          step="0.01"
                          register={register(`items.${index}.price` as const, {
                            valueAsNumber: true,
                          })}
                          error={errors.items?.[index]?.price?.message}
                        />
                      </div>
                      <div className="col-span-1 pb-3 text-right">
                        <span className="font-bold text-xs text-blackText dark:text-white">
                          {totalAmount}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="col-span-1 flex justify-center pb-3 pl-3 text-grayish-blue hover:text-red-custom transition-colors cursor-pointer"
                      >
                        <Trash />
                      </button>
                    </div>
                  );
                })}
              </div>

              <CustomButton
                type="button"
                variant="secondary"
                className="w-full mt-2"
                onClick={() =>
                  append({ name: "", quantity: 1, price: 0, total: 0 })
                }
              >
                + Add New Item
              </CustomButton>
            </div>
          </div>

          <div className="flex justify-end gap-3 bg-white dark:bg-very-dark-blue pt-4 pb-4 border-t border-slate-100 dark:border-[#252945] mt-6">
            <CustomButton type="button" variant="secondary" onClick={onClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary">
              Save Changes
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};
