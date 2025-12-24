import type React from "react";
import { useState, useEffect, useRef } from "react";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  label?: string;
  options: Option[];
  defaultSelected?: string[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  value,
  onChange,
  disabled = false,
  placeholder = "Pilih kategori...",
  style,
}) => {
  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] =
    useState<string[]>(defaultSelected);
  const selectedOptions = isControlled ? value : internalSelected;
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const updateSelection = (newSelected: string[]) => {
    if (!isControlled) setInternalSelected(newSelected);
    onChange?.(newSelected);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setFocusedIndex(-1);
    }
  };

  const handleSelect = (optionValue: string) => {
    const newSelected = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((v) => v !== optionValue)
      : [...selectedOptions, optionValue];
    updateSelection(newSelected);
  };

  const removeOption = (optionValue: string) => {
    updateSelection(selectedOptions.filter((v) => v !== optionValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    e.preventDefault();
    switch (e.key) {
      case "Enter":
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;
      case "ArrowUp":
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;
    }
  };

  const allSelected = selectedOptions.length === options.length;

  return (
    <div className="relative" ref={dropdownRef} style={style}>
      {label && (
        <label
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400"
          id={`${label}-label`}
        >
          {label}
        </label>
      )}

      <div className="relative inline-block w-full">
        <div
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          className="w-full"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={`${label}-label`}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <div
            className={`flex items-center justify-between rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <div className="flex flex-wrap items-center gap-1 overflow-x-auto max-h-[2.2rem] scrollbar-thin">
              {/* ✅ tampilkan placeholder kalau semua atau tidak ada yang dipilih */}
              {allSelected || selectedOptions.length === 0 ? (
                <span className="text-gray-500 text-xs">{placeholder}</span>
              ) : (
                selectedOptions.map((value) => {
                  const text =
                    options.find((opt) => opt.value === value)?.text || value;
                  return (
                    <div
                      key={value}
                      className="group flex items-center rounded-full bg-white dark:bg-gray-700 border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-100"
                    >
                      <span>{text}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(value);
                        }}
                        className="pl-1 text-gray-500 hover:text-gray-700 dark:text-gray-300"
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            <svg
              className={`w-4 h-4 ml-2 text-gray-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* ✅ Dropdown: tetap tampil semua opsi meskipun semua terpilih */}
        {isOpen && (
          <div className="absolute left-0 z-50 mt-1 w-full bg-white rounded-lg shadow-md border border-gray-200 dark:bg-gray-900 dark:border-gray-700 max-h-60 overflow-y-auto">
            {options.map((option, index) => {
              const isSelected = selectedOptions.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={`px-3 py-2 text-sm cursor-pointer flex justify-between items-center ${
                    index === focusedIndex ? "bg-gray-100 dark:bg-gray-800" : ""
                  } hover:bg-gray-100 dark:hover:bg-gray-800`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.text}</span>
                  {isSelected && <span className="text-brand-500 font-bold">✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
