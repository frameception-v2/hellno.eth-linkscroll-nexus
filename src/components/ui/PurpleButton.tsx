interface PurpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: "default" | "outline";
}

export function PurpleButton({ children, className = "", isLoading = false, variant = "default", ...props }: PurpleButtonProps) {
  const baseStyles = "w-full max-w-xs mx-auto block py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyles = variant === "outline" 
    ? "border border-[#7C65C1] text-[#7C65C1] hover:bg-[#7C65C1]/10" 
    : "bg-[#7C65C1] text-white hover:bg-[#6952A3]";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
