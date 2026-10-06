import type { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  register,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <div className="flex justify-between items-center text-xs font-medium tracking-wide">
        <label
          className={`dark:text-slate-300 ${error ? "text-red-custom" : "text-grayish-blue"}`}
        >
          {label}
        </label>
        {error && (
          <span className="text-red-custom font-semibold text-[10px]">
            {error}
          </span>
        )}
      </div>
      <input
        {...register}
        {...props}
        className={`w-full h-12 px-5 rounded border bg-white dark:bg-dark-purple font-bold text-sm text-blackText dark:text-white outline-none focus:border-purple transition-colors ${
          error ? "border-red-custom" : "border-slate-200 dark:border-[#252945]"
        }`}
      />
    </div>
  );
};
