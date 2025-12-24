import { ReactNode } from "react";
import type {
  MutuDashboardResponse,
  RiskLevel,
} from "../../services/dashboard";
import Alert from "../ui/alert/Alert";

type KPIProps = {
  totalIncidents?: number;
  jenisKejadian?: MutuDashboardResponse["jenis_kejadian"];
  riskLevel?: RiskLevel;
};

const defaultJenis: MutuDashboardResponse["jenis_kejadian"] = {
  KTD: 0,
  KTC: 0,
  KNC: 0,
  KPCS: 0,
  SENTINEL: 0,
};

export default function KPI({
  totalIncidents = 0,
  jenisKejadian = defaultJenis,
  riskLevel = "rendah",
}: KPIProps) {
  const merged = { ...defaultJenis, ...jenisKejadian };

  const KTD = merged.KTD ?? 0;
  const KTC = merged.KTC ?? 0;
  const KNC = merged.KNC ?? 0;
  const KPCS = merged.KPCS ?? 0;
  const SENTINEL = merged.SENTINEL ?? 0;

  let variant: "success" | "warning" | "error" | "info" = "info";
  let title: ReactNode = null;
  let message: ReactNode = null;

  const normalizedRisk =
    riskLevel === "sedang"
      ? "moderat"
      : riskLevel === "tidak tersedia"
      ? "rendah"
      : riskLevel;

  switch (normalizedRisk) {
    case "rendah":
      variant = "info";
      title = (
        <span className="text-xl font-semibold block text-center">
          Risiko Rendah
        </span>
      );
      message = (
        <span className="text-base block text-center leading-relaxed">
          Kondisi saat ini berada pada tingkat risiko rendah.
        </span>
      );
      break;

    case "moderat":
      variant = "success";
      title = (
        <span className="text-xl font-semibold block text-center">
          Risiko Moderat
        </span>
      );
      message = (
        <span className="text-base block text-center leading-relaxed">
          Kondisi saat ini berada pada tingkat risiko moderat.
        </span>
      );
      break;

    case "tinggi":
      variant = "warning";
      title = (
        <span className="text-xl font-semibold block text-center">
          Risiko Tinggi
        </span>
      );
      message = (
        <span className="text-base block text-center leading-relaxed">
          Kondisi saat ini berada pada tingkat risiko tinggi.
        </span>
      );
      break;

    case "ekstrem":
      variant = "error";
      title = (
        <span className="text-xl font-semibold block text-center">
          Risiko Ekstrem
        </span>
      );
      message = (
        <span className="text-base block text-center leading-relaxed">
          Kondisi saat ini berada pada tingkat risiko ekstrem.
        </span>
      );
      break;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_5fr_5fr] md:gap-6">
      
      {/* TOTAL INSIDEN */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-4">
        <div className="mt-4 space-y-2">
          <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-white/90">
            Total Insiden
          </h3>
          <h4 className="text-3xl font-bold text-center text-gray-800 dark:text-white/90">
            {totalIncidents}
          </h4>
        </div>
      </div>

      {/* JENIS KEJADIAN */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-4">
        <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-white/90">
          Jenis Kejadian
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
          {/* KTD */}
          <div className="text-center">
            <p className="mb-1 text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">KTD</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white/90">{KTD}</p>
          </div>

          <div className="hidden sm:block w-px h-7 bg-gray-200 dark:bg-gray-800"></div>

          {/* KTC */}
          <div className="text-center">
            <p className="mb-1 text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">KTC</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white/90">{KTC}</p>
          </div>

          <div className="hidden sm:block w-px h-7 bg-gray-200 dark:bg-gray-800"></div>

          {/* KNC */}
          <div className="text-center">
            <p className="mb-1 text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">KNC</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white/90">{KNC}</p>
          </div>

          <div className="hidden sm:block w-px h-7 bg-gray-200 dark:bg-gray-800"></div>

          {/* KPCS */}
          <div className="text-center">
            <p className="mb-1 text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">KPCS</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white/90">{KPCS}</p>
          </div>

          <div className="hidden sm:block w-px h-7 bg-gray-200 dark:bg-gray-800"></div>

          {/* SENTINEL */}
          <div className="text-center">
            <p className="mb-1 text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Sentinel</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white/90">{SENTINEL}</p>
          </div>
        </div>
      </div>

      {/* ALERT */}
      <Alert variant={variant} title={title} message={message} />
    </div>
  );
}
