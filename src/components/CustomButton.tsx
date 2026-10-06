import { Plus } from "lucide-react";

// Type for the button variants.
type ButtonVariant = "primary" | "secondary" | "dark" | "danger";

// heredity from React's button attributes, allowing for standard button props.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  hasIcon?: boolean; // Does it have the circular plus button for new invoices?
  children: React.ReactNode;
}

export const CustomButton: React.FC<ButtonProps> = ({
  variant = "primary",
  hasIcon = false,
  children,
  className = "",
  ...props
}) => {
  // Styles for the button based on the variant.
  const baseStyles =
    "inline-flex items-center justify-center font-bold text-sm rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50";

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-purple hover:bg-purple-light text-white px-6 py-4",
    secondary:
      "bg-light-bg hover:bg-slate-200 hover:text-dark-purple text-dark-gray px-6 py-4 dark:bg-dark-purple dark:text-white dark:hover:bg-white dark:hover:text-blackText",
    dark: "bg-[#373B53] hover:bg-very-dark-blue text-slate-300 px-6 py-4",
    danger: "bg-red-custom hover:bg-red-light text-white px-6 py-4",
  };

  const paddingStyle = hasIcon ? "pl-2 pr-6 py-2 h-12" : "px-6 py-4";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyle} group ${className}`}
      {...props}
    >
      {hasIcon && (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-purple mr-4 transition-transform group-hover:scale-105">
          <Plus className=" text-purple" />
        </span>
      )}
      {children}
    </button>
  );
};
