import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { ChevronDownIcon } from "../../icons";
import MultiSelect from "../form/MultiSelect";
import {
  fetchMutuTrend,
  type MutuTrendResponse,
  type TrendGroup,
  type TrendView,
} from "../../services/dashboard";

type PlotMode = "umum" | "jenis" | "grading";

type IncidentTrendChartProps = {
  unit: string;
};

const plotModeToGroup: Record<PlotMode, TrendGroup> = {
  umum: "total",
  jenis: "jenis",
  grading: "grading",
};

const niceScale = (maxValue: number) => {
  if (maxValue <= 5) return { max: Math.max(5, maxValue), step: 1 };
  const rough = maxValue / 5;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const niceStep = Math.ceil(rough / mag) * mag;
  const niceMax = Math.ceil(maxValue / niceStep) * niceStep;
  return { max: niceMax, step: niceStep };
};

export default function IncidentTrendChart({ unit }: IncidentTrendChartProps) {
  const [viewMode, setViewMode] = useState<TrendView>("monthly");
  const [plotMode, setPlotMode] = useState<PlotMode>("umum");
  const [filter, setFilter] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState({
    plot: false,
    view: false,
  });
  const [windowSize, setWindowSize] = useState(12);
  const [trendData, setTrendData] = useState<MutuTrendResponse | null>(null);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const response = await fetchMutuTrend({
          unit: unit || "all",
          view: viewMode,
          group: plotModeToGroup[plotMode],
        });
        if (!active) return;
        setTrendData(response);
      } catch (err) {
        if (!active) return;
        console.error("Gagal memuat data tren insiden", err);
        setTrendData(null);
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, [unit, viewMode, plotMode]);

  useEffect(() => {
    if (!trendData) return;
    const keys = trendData.series.map((s) => s.key);
    setFilter(keys);
    setWindowSize((prev) => {
      const len = trendData.periods.length;
      if (!len) return prev;
      const clamped = Math.min(len, Math.max(3, prev));
      return clamped;
    });
  }, [trendData]);

  const categories = trendData?.periods ?? [];
  const availableSeries = trendData?.series ?? [];
  const selectedKeys =
    filter.length > 0
      ? new Set(filter)
      : new Set(availableSeries.map((s) => s.key));

  const filteredSeries = availableSeries.filter((series) =>
    selectedKeys.has(series.key)
  );

  const sliderMax = Math.max(categories.length, 3);
  const sliderValue = Math.min(windowSize, sliderMax);
  const sliceEnd = categories.length;
  const sliceStart = Math.max(0, sliceEnd - sliderValue);
  const displayCategories = categories.slice(sliceStart, sliceEnd);
  const displaySeries = filteredSeries.map((series) => ({
    name: series.label,
    data: series.data.slice(sliceStart, sliceEnd),
  }));

  const { max: maxY, step: stepY } = useMemo(() => {
    let maxPoint = 0;
    displaySeries.forEach((serie) =>
      serie.data.forEach((value) => {
        if (value > maxPoint) maxPoint = value;
      })
    );
    const { max, step } = niceScale(Math.max(1, maxPoint));
    return { max, step };
  }, [displaySeries]);

  const intervalLabel =
    viewMode === "weekly"
      ? "minggu"
      : viewMode === "monthly"
      ? "bulan"
      : viewMode === "quarterly"
      ? "kuartal"
      : "tahun";

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const chartColors =
    plotMode === "grading"
      ? ["#EF4444", "#FACC15", "#10B981", "#3B82F6"]
      : plotMode === "jenis"
      ? ["#EF4444", "#F59E0B", "#3B82F6", "#10B981", "#8B5CF6"]
      : ["#465FFF", "#9CB9FF"];

  const options: ApexOptions = {
    legend: {
      show: plotMode !== "umum" && filteredSeries.length > 0,
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: isDark ? "#e5e7eb" : "#374151",
      },
    },
    colors: chartColors,
    chart: {
      type: "line",
      height: 310,
      toolbar: { show: false },
      background: "transparent",
      foreColor: isDark ? "#d1d5db" : "#374151",
    },
    stroke: { curve: "straight", width: 2 },
    markers: { size: 3 },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: (v) => `${v} kejadian` },
    },
    grid: {
      borderColor: isDark ? "#4b5563" : "#e5e7eb",
    },
    xaxis: {
      categories: displayCategories,
      labels: {
        style: {
          fontSize: "12px",
          colors: isDark ? "#d1d5db" : "#374151",
        },
      },
    },
    yaxis: {
      min: 0,
      max: maxY,
      tickAmount: Math.max(1, Math.floor(maxY / stepY)),
      labels: {
        formatter: (v) => Math.round(v).toString(),
        style: {
          fontSize: "12px",
          colors: isDark ? "#d1d5db" : "#374151",
        },
      },
    },
  };

  const plotLabel =
    plotMode === "umum"
      ? "Total Insiden"
      : plotMode === "jenis"
      ? "Jenis Insiden"
      : "Grading Risiko";

  const viewLabel =
    viewMode === "weekly"
      ? "Mingguan"
      : viewMode === "monthly"
      ? "Bulanan"
      : viewMode === "quarterly"
      ? "Triwulan"
      : "Tahunan";

  const multiSelectOptions = availableSeries.map((series) => ({
    value: series.key,
    text: series.label,
  }));

  const multiSelectValue =
    filter.length > 0
      ? filter
      : multiSelectOptions.map((option) => option.value);

  const handleFilterChange = (values: string[]) => {
    if (values.length === 0) {
      setFilter(multiSelectOptions.map((option) => option.value));
    } else {
      setFilter(values);
    }
  };

  return (
    <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-700 px-5 pb-5 pt-5">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between sm:items-start">
        <h3 className="text-lg font-semibold dark:text-gray-100">
          Tren Jumlah Kejadian
        </h3>

        <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                onClick={() =>
                  setDropdownOpen((prev) => ({
                    plot: !prev.plot,
                    view: false,
                  }))
                }
                className="flex items-center justify-between w-44 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm dark:text-gray-100"
              >
                {plotLabel}
                <ChevronDownIcon className="w-4 h-4 ml-2" />
              </button>

              {dropdownOpen.plot && (
                <div className="absolute right-0 z-50 mt-1 w-44 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-xl shadow-lg">
                  {[
                    { key: "umum", label: "Total Insiden" },
                    { key: "jenis", label: "Jenis Insiden" },
                    { key: "grading", label: "Grading Risiko" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setPlotMode(item.key as PlotMode);
                        setDropdownOpen({ plot: false, view: false });
                      }}
                      className="block w-full px-4 py-2 text-left text-sm dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {(plotMode === "jenis" || plotMode === "grading") &&
              multiSelectOptions.length > 0 && (
                <MultiSelect
                  options={multiSelectOptions}
                  value={multiSelectValue}
                  onChange={handleFilterChange}
                />
              )}

            <div className="relative">
              <button
                onClick={() =>
                  setDropdownOpen((prev) => ({
                    plot: false,
                    view: !prev.view,
                  }))
                }
                className="flex items-center justify-between w-36 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm dark:text-gray-100"
              >
                {viewLabel}
                <ChevronDownIcon className="w-4 h-4 ml-2" />
              </button>

              {dropdownOpen.view && (
                <div className="absolute right-0 z-50 mt-1 w-36 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-xl shadow-lg">
                  {[
                    { key: "weekly", label: "Mingguan" },
                    { key: "monthly", label: "Bulanan" },
                    { key: "quarterly", label: "Triwulan" },
                    { key: "yearly", label: "Tahunan" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setViewMode(item.key as TrendView);
                        setDropdownOpen({ plot: false, view: false });
                      }}
                      className="block w-full px-4 py-2 text-left text-sm dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-full sm:w-64 mt-2 sm:mt-0">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-300">
                {sliderValue} {intervalLabel} terakhir
              </span>
            </div>

            <input
              type="range"
              min={3}
              max={sliderMax}
              value={sliderValue}
              onChange={(e) => setWindowSize(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>
        </div>
      </div>

      <Chart options={options} series={displaySeries} type="line" height={310} />
    </div>
  );
}
