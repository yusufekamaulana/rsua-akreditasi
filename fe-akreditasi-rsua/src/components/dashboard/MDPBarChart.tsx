import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import type { MutuDashboardResponse } from "../../services/dashboard";

type MDPBarChartProps = {
  mdpData?: MutuDashboardResponse["mdp"];
};

const DEFAULT_MDP_KEYS = [
  "MDP 1",
  "MDP 2",
  "MDP 3",
  "MDP 4",
  "MDP 5",
  "MDP 6",
  "MDP 7",
  "MDP 8",
  "MDP 9",
  "MDP 10",
  "MDP 11",
  "MDP 12",
  "MDP 13",
  "MDP 14",
  "MDP 15",
  "MDP 16",
  "MDP 17",
];

const MDP_DESCRIPTIONS: Record<string, string> = {
  "MDP 1": "Melakukan praktik keprofesian tidak kompeten",
  "MDP 2": "Tidak merujuk pasien kepada tenaga medis kompeten",
  "MDP 3": "Merujuk ke tenaga kesehatan tidak kompeten",
  "MDP 4": "Mengabaikan tanggung jawab profesi",
  "MDP 5": "Menghentikan kehamilan tanpa dasar hukum",
  "MDP 6": "Penyalahgunaan kewenangan profesi",
  "MDP 7": "Penyalahgunaan alkohol/obat terlarang",
  "MDP 8": "Penipuan atau tidak memberi penjelasan memadai",
  "MDP 9": "Membuka rahasia pasien tanpa pembenaran",
  "MDP 10": "Perbuatan tidak patut/unsur seksual",
  "MDP 11": "Menolak/menghentikan tindakan tanpa alasan",
  "MDP 12": "Pemeriksaan atau pengobatan berlebihan",
  "MDP 13": "Meresepkan obat yang tidak sesuai kebutuhan",
  "MDP 14": "Tidak membuat atau menyimpan rekam medis",
  "MDP 15": "Keterangan medis tanpa pemeriksaan",
  "MDP 16": "Turut serta melakukan penyiksaan/kejam",
  "MDP 17": "Mengiklankan diri/perang tarif",
};

export default function MDPBarChart({ mdpData = {} }: MDPBarChartProps) {
  const dropdown = useModal();
  const descModal = useModal();
  const downloadModal = useModal();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const data = useMemo(() => {
    const entries: Array<[string, number]> =
      Object.keys(mdpData).length > 0
        ? (Object.entries(mdpData) as Array<[string, number]>)
        : DEFAULT_MDP_KEYS.map((key): [string, number] => [key, 0]);
    entries.sort(([a], [b]) => a.localeCompare(b, "id", { numeric: true }));
    return entries.map(([code, value]) => ({
      code,
      label: MDP_DESCRIPTIONS[code] ?? code,
      value: value ?? 0,
      date: "",
    }));
  }, [mdpData]);

  const filteredData = data.filter((item) => {
    if (startDate && item.date && item.date < startDate) return false;
    if (endDate && item.date && item.date > endDate) return false;
    return true;
  });

  const downloadCSV = () => {
    const rows = [["Kode", "Deskripsi", "Jumlah", "Tanggal"]];
    filteredData.forEach((d) =>
      rows.push([d.label, String(d.value), d.date || "-"])
    );

    const csv = "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = "mdp_data.csv";
    a.click();
  };

  const downloadExcel = async () => {
    const XLSX = await import("xlsx");

    const rows = [["Kode", "Deskripsi", "Jumlah", "Tanggal"]];
    filteredData.forEach((d) =>
      rows.push([d.label, String(d.value), d.date || "-"])
    );

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MDP Data");
    XLSX.writeFile(wb, "mdp_data.xlsx");
  };

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: { type: "bar", height: 260, toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    plotOptions: { bar: { horizontal: false, columnWidth: "45%", borderRadius: 6, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: data.map((d) => d.code),
      labels: { rotate: -45, style: { fontSize: "11px" } },
    },
    tooltip: {
      y: { formatter: (val) => `${val} kasus` },
      x: { formatter: (_, opts) => data[opts.dataPointIndex].label },
    },
    grid: { yaxis: { lines: { show: true } } },
  };

  const series = [{ name: "Jumlah", data: data.map((d) => d.value) }];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Distribusi MDP</h3>

        <button onClick={dropdown.openModal}>
          <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
        </button>

        <Dropdown isOpen={dropdown.isOpen} onClose={dropdown.closeModal} className="w-44 p-2">
          <DropdownItem
            onItemClick={() => {
              dropdown.closeModal();
              descModal.openModal();
            }}
            className="flex w-full text-left text-gray-500 dark:text-gray-400 dark:hover:bg-white/5"
          >
            Deskripsi
          </DropdownItem>

          <DropdownItem
            onItemClick={() => {
              dropdown.closeModal();
              downloadModal.openModal();
            }}
            className="flex w-full text-left text-gray-500 dark:text-gray-400 dark:hover:bg-white/5"
          >
            Download Data
          </DropdownItem>
        </Dropdown>
      </div>

      {/* CHART */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[800px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={260} />
        </div>
      </div>

      {/* ====================== */}
      {/* MODAL DESKRIPSI        */}
      {/* ====================== */}
      <Modal isOpen={descModal.isOpen} onClose={descModal.closeModal} className="max-w-[600px] m-4">
        <div className="rounded-3xl bg-white p-6 dark:bg-gray-900">
          <h4 className="text-xl font-semibold dark:text-white/90 mb-3">Deskripsi MDP</h4>

          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dictum sapien non nibh
            feugiat, sed malesuada turpis aliquet. Praesent euismod lorem sit amet sem suscipit auctor.
          </p>

          <div className="flex justify-end mt-6">
            <Button size="sm" variant="outline" onClick={descModal.closeModal}>
              Tutup
            </Button>
          </div>
        </div>
      </Modal>

      {/* ====================== */}
      {/* MODAL DOWNLOAD         */}
      {/* ====================== */}
      <Modal isOpen={downloadModal.isOpen} onClose={downloadModal.closeModal} className="max-w-[600px] m-4">
        <div className="rounded-3xl bg-white p-6 dark:bg-gray-900">
          <h4 className="text-xl font-semibold dark:text-white/90 mb-4">Download Data MDP</h4>

          {/* Filter tanggal */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Tanggal Awal</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div>
              <Label>Tanggal Akhir</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* PREVIEW */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mt-4 text-sm">
            {filteredData.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">Tidak ada data dalam rentang tanggal.</p>
            )}

            {filteredData.map((d) => (
              <div key={d.code + d.date} className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>{d.code}</span>
                <span>{d.value}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={downloadModal.closeModal}>
              Batal
            </Button>

            <Button size="sm" onClick={downloadCSV}>
              Download CSV
            </Button>

            <Button size="sm" onClick={downloadExcel}>
              Download Excel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
