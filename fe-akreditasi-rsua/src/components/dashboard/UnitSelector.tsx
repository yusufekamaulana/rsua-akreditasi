import React from "react";

interface UnitSelectorProps {
  selectedUnit: string;
  onChange: (value: string) => void;
  units?: string[];
}

const defaultUnits = [
  "All",
  "ICU",
  "IRNA 5 RSUA",
  "PICU",
  "Poli Rehab Medik",
  "Radiologi",
  "Laboratorium",
  "Poli Mata",
  "Rawat Inap",
];

export default function UnitSelector({
  selectedUnit,
  onChange,
  units,
}: UnitSelectorProps) {
  const availableUnits = units && units.length > 0 ? units : defaultUnits;

  return (
    <div className="w-full">
      {/* LABEL */}
      <label className="block text-center text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Filter Unit
      </label>

      {/* SELECT FULL WIDTH + TEXT CENTER */}
      <select
        value={selectedUnit}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-xl border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-800
          py-4 px-5
          text-gray-800 dark:text-gray-100
          text-xl text-center
          shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          hover:border-blue-400 transition
        "
      >
        {availableUnits.map((unit) => (
          <option
            key={unit}
            value={unit}
            className="text-lg text-center"
          >
            {unit === 'All' ? 'Semua Unit' : unit}
          </option>
        ))}
      </select>
    </div>
  );
}
