import React from "react";
import { cn } from "../../lib/utils";

const Select = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      value={value}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

const SelectOption = ({ value, children, className }) => (
  <option value={value} className={cn("text-sm", className)}>
    {children}
  </option>
);

export { Select, SelectOption };
