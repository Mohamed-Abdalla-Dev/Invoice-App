//Formatting helper functions
export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

export const formatCurrency = (amount: number, currencyCode: string) => {
  const currency = currencyCode || "GBP";
  return new Intl.NumberFormat(currency === "GBP" ? "en-GB" : "en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};
