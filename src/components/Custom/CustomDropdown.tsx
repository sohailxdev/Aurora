import * as React from "react";
import { SortDesc } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortOption {
  value: string;
  label: string;
}

interface CustomSortDropdownProps {
  title: string;
  icon: React.ReactNode;
  options: SortOption[];
  onChange: (value: string) => void;
}

export function CustomDropdown({
  options,
  onChange,
  icon,
  title,
}: CustomSortDropdownProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1 text-sm font-medium focus:outline-none"
          aria-label="Sort options"
        >
          {icon}
          <span>{title}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="start">
        {options.map((option) => (
          <DropdownMenuItem
            className="cursor-pointer"
            key={option.value}
            onSelect={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
