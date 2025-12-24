import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";
import {
  listIncidents,
  type IncidentRead as APIIncident,
  type IncidentCategory as APIIncidentCategory,
} from "../../../services/incidents";

/* =========================================================
   INCIDENT INTERFACE FINAL
========================================================= */
interface Incident {
  id: number;
  nama: string;
  no_rm: string;
  umur: number;
  kelompok_usia: string;
  jenis_kelamin: "L" | "P";
  penanggung_biaya: "umum" | "bpjs-mandiri" | "sktm";

  tanggal_masuk: string;
  tanggal_insiden: string;
  waktu_insiden: string;

  kronologi_insiden: string;

  pelapor:
  | "dokter"
  | "perawat"
  | "petugas-lain"
  | "pasien"
  | "keluarga"
  | "pengunjung"
  | "lain";

  insiden_terjadi_pada: "pasien" | "lain";
  jenis_pasien: "rawat-inap" | "ugd" | "rawat-jalan" | "lain";

  tempat_insiden: string;
  unit: string;

  akibat:
  | "kematian"
  | "cedera-berat"
  | "cedera-sedang"
  | "cedera-ringan"
  | "tidak-cedera";

  tindakan_segera: string;

  tindakan_oleh: {
    dokter: boolean;
    perawat: boolean;
    petugas_lain: boolean;
  };

  pernah_terjadi: boolean;
  kapan_terjadi?: string;
  langkah_pencegahan?: string;

  jenis_insiden_output: "KTD" | "KTC" | "KNC" | "KPCS" | "Sentinel";
  skp_output: "SKP 1" | "SKP 2" | "SKP 3" | "SKP 4" | "SKP 5" | "SKP 6";
  mdp_output:
  | "MDP 1"
  | "MDP 2"
  | "MDP 3"
  | "MDP 4"
  | "MDP 5"
  | "MDP 6"
  | "MDP 7"
  | "MDP 8"
  | "MDP 9"
  | "MDP 10"
  | "MDP 11"
  | "MDP 12"
  | "MDP 13"
  | "MDP 14"
  | "MDP 15"
  | "MDP 16"
  | "MDP 17";

  keterangan: "Klasifikasi AI" | "Revisi Unit" | "Revisi Mutu";
}

/* =========================================================
   DUMMY DATA
========================================================= */
const initialIncidents: Incident[] = [
  {
    id: 1,
    nama: "Ny. Maria",
    no_rm: "332211",
    umur: 54,
    kelompok_usia: "dewasa",
    jenis_kelamin: "P",
    penanggung_biaya: "bpjs-mandiri",
    tanggal_masuk: "2025-10-03",
    tanggal_insiden: "2025-10-10",
    waktu_insiden: "14:25",
    kronologi_insiden: "Obat diberikan tidak sesuai dosis oleh petugas baru.",
    pelapor: "perawat",
    insiden_terjadi_pada: "pasien",
    jenis_pasien: "rawat-inap",
    tempat_insiden: "penyakit-dalam",
    unit: "rawat-inap",
    akibat: "cedera-ringan",
    tindakan_segera: "Dilakukan penanganan awal.",
    tindakan_oleh: { dokter: true, perawat: true, petugas_lain: false },
    pernah_terjadi: false,
    jenis_insiden_output: "KTD",
    skp_output: "SKP 3",
    mdp_output: "MDP 12",
    keterangan: "Klasifikasi AI",
  },
  {
    id: 2,
    nama: "Tn. Budi Santoso",
    no_rm: "887744",
    umur: 62,
    kelompok_usia: "lansia",
    jenis_kelamin: "L",
    penanggung_biaya: "umum",
    tanggal_masuk: "2025-09-20",
    tanggal_insiden: "2025-09-21",
    waktu_insiden: "09:10",
    kronologi_insiden: "Pasien jatuh saat menuju kamar mandi.",
    pelapor: "keluarga",
    insiden_terjadi_pada: "pasien",
    jenis_pasien: "rawat-inap",
    tempat_insiden: "saraf",
    unit: "rawat-inap",
    akibat: "cedera-sedang",
    tindakan_segera: "Dilakukan pemeriksaan fisik lengkap.",
    tindakan_oleh: { dokter: true, perawat: true, petugas_lain: false },
    pernah_terjadi: true,
    kapan_terjadi: "2024-03-12",
    langkah_pencegahan: "Dipasang pegangan tambahan di kamar mandi.",
    jenis_insiden_output: "KNC",
    skp_output: "SKP 6",
    mdp_output: "MDP 4",
    keterangan: "Revisi Unit",
  },
  {
    id: 3,
    nama: "Ny. Rini Wijaya",
    no_rm: "551122",
    umur: 38,
    kelompok_usia: "dewasa",
    jenis_kelamin: "P",
    penanggung_biaya: "sktm",
    tanggal_masuk: "2025-08-15",
    tanggal_insiden: "2025-08-16",
    waktu_insiden: "11:40",
    kronologi_insiden: "Salah pemberian infus karena label tidak jelas.",
    pelapor: "dokter",
    insiden_terjadi_pada: "pasien",
    jenis_pasien: "ugd",
    tempat_insiden: "obgyn",
    unit: "ugd",
    akibat: "cedera-ringan",
    tindakan_segera: "Infus dihentikan dan diganti yang benar.",
    tindakan_oleh: { dokter: true, perawat: true, petugas_lain: false },
    pernah_terjadi: false,
    jenis_insiden_output: "KTD",
    skp_output: "SKP 2",
    mdp_output: "MDP 8",
    keterangan: "Revisi Mutu",
  },
  {
    id: 4,
    nama: "Tn. Andi Prasetyo",
    no_rm: "998877",
    umur: 29,
    kelompok_usia: "dewasa",
    jenis_kelamin: "L",
    penanggung_biaya: "bpjs-mandiri",
    tanggal_masuk: "2025-07-21",
    tanggal_insiden: "2025-07-22",
    waktu_insiden: "20:15",
    kronologi_insiden: "Keterlambatan pemberian obat rutin malam.",
    pelapor: "perawat",
    insiden_terjadi_pada: "pasien",
    jenis_pasien: "rawat-inap",
    tempat_insiden: "tht",
    unit: "rawat-inap",
    akibat: "tidak-cedera",
    tindakan_segera: "Obat langsung diberikan.",
    tindakan_oleh: { dokter: false, perawat: true, petugas_lain: false },
    pernah_terjadi: false,
    jenis_insiden_output: "KTC",
    skp_output: "SKP 3",
    mdp_output: "MDP 14",
    keterangan: "Klasifikasi AI",
  },
  {
    id: 5,
    nama: "Ny. Sari Dewi",
    no_rm: "123456",
    umur: 47,
    kelompok_usia: "dewasa",
    jenis_kelamin: "P",
    penanggung_biaya: "umum",
    tanggal_masuk: "2025-06-01",
    tanggal_insiden: "2025-06-02",
    waktu_insiden: "16:50",
    kronologi_insiden: "Kesalahan dokumentasi pada rekam medis.",
    pelapor: "petugas-lain",
    insiden_terjadi_pada: "lain",
    jenis_pasien: "lain",
    tempat_insiden: "administrasi",
    unit: "rekam-medis",
    akibat: "tidak-cedera",
    tindakan_segera: "Dokumen diperbaiki dan diverifikasi ulang.",
    tindakan_oleh: { dokter: false, perawat: false, petugas_lain: true },
    pernah_terjadi: true,
    kapan_terjadi: "2024-11-05",
    langkah_pencegahan: "SOP dokumentasi diperbarui.",
    jenis_insiden_output: "KPCS",
    skp_output: "SKP 1",
    mdp_output: "MDP 15",
    keterangan: "Revisi Unit",
  },
  {
    id: 6,
    nama: "An. Lala Putri",
    no_rm: "776655",
    umur: 5,
    kelompok_usia: "anak",
    jenis_kelamin: "P",
    penanggung_biaya: "bpjs-mandiri",
    tanggal_masuk: "2025-05-11",
    tanggal_insiden: "2025-05-12",
    waktu_insiden: "08:20",
    kronologi_insiden: "Pasien anak mengalami alergi obat.",
    pelapor: "orangtua" as any,
    insiden_terjadi_pada: "pasien",
    jenis_pasien: "rawat-inap",
    tempat_insiden: "anak",
    unit: "rawat-inap",
    akibat: "cedera-berat",
    tindakan_segera: "Dilakukan penanganan alergi segera.",
    tindakan_oleh: { dokter: true, perawat: true, petugas_lain: true },
    pernah_terjadi: false,
    jenis_insiden_output: "Sentinel",
    skp_output: "SKP 3",
    mdp_output: "MDP 6",
    keterangan: "Klasifikasi AI",
  },
  {
    id: 7,
    nama: "Tn. Yusuf Hidayat",
    no_rm: "441199",
    umur: 33,
    kelompok_usia: "dewasa",
    jenis_kelamin: "L",
    penanggung_biaya: "umum",
    tanggal_masuk: "2025-04-18",
    tanggal_insiden: "2025-04-19",
    waktu_insiden: "13:00",
    kronologi_insiden: "Terjadi salah penempatan gelang identitas.",
    pelapor: "petugas-lain",
    insiden_terjadi_pada: "pasien",
    jenis_pasien: "rawat-jalan",
    tempat_insiden: "administrasi",
    unit: "ugd",
    akibat: "tidak-cedera",
    tindakan_segera: "Gelang diganti dengan identitas yang benar.",
    tindakan_oleh: { dokter: false, perawat: true, petugas_lain: true },
    pernah_terjadi: false,
    jenis_insiden_output: "KNC",
    skp_output: "SKP 1",
    mdp_output: "MDP 9",
    keterangan: "Revisi Mutu",
  },
  {
    id: 8,
    nama: "Ny. Yuni Lestari",
    no_rm: "998822",
    umur: 52,
    kelompok_usia: "dewasa",
    jenis_kelamin: "P",
    penanggung_biaya: "sktm",
    tanggal_masuk: "2025-03-22",
    tanggal_insiden: "2025-03-23",
    waktu_insiden: "12:10",
    kronologi_insiden: "Terjadi kesalahan komunikasi antar perawat.",
    pelapor: "perawat",
    insiden_terjadi_pada: "pasien",
    jenis_pasien: "rawat-inap",
    tempat_insiden: "paru",
    unit: "rawat-inap",
    akibat: "cedera-ringan",
    tindakan_segera: "Dilakukan komunikasi ulang dan koreksi tindakan.",
    tindakan_oleh: { dokter: false, perawat: true, petugas_lain: false },
    pernah_terjadi: true,
    kapan_terjadi: "2024-01-10",
    langkah_pencegahan: "Briefing rutin per shift.",
    jenis_insiden_output: "KTD",
    skp_output: "SKP 2",
    mdp_output: "MDP 2",
    keterangan: "Revisi Unit",
  },
  {
    id: 9,
    nama: "Tn. Raka Pramudya",
    no_rm: "778899",
    umur: 45,
    kelompok_usia: "dewasa",
    jenis_kelamin: "L",
    penanggung_biaya: "bpjs-mandiri",
    tanggal_masuk: "2025-02-05",
    tanggal_insiden: "2025-02-06",
    waktu_insiden: "10:30",
    kronologi_insiden: "Penggunaan alat yang tidak sesuai SOP.",
    pelapor: "petugas-lain",
    insiden_terjadi_pada: "lain",
    jenis_pasien: "lain",
    tempat_insiden: "bedah",
    unit: "kamar-operasi",
    akibat: "cedera-sedang",
    tindakan_segera: "Operator lain mengambil alih tindakan.",
    tindakan_oleh: { dokter: true, perawat: true, petugas_lain: true },
    pernah_terjadi: false,
    jenis_insiden_output: "Sentinel",
    skp_output: "SKP 4",
    mdp_output: "MDP 7",
    keterangan: "Klasifikasi AI",
  },
  {
    id: 10,
    nama: "Ny. Amira Rahmadani",
    no_rm: "332299",
    umur: 60,
    kelompok_usia: "lansia",
    jenis_kelamin: "P",
    penanggung_biaya: "umum",
    tanggal_masuk: "2025-01-18",
    tanggal_insiden: "2025-01-19",
    waktu_insiden: "17:45",
    kronologi_insiden: "Terjadi keterlambatan evaluasi hasil lab.",
    pelapor: "dokter",
    insiden_terjadi_pada: "pasien",
    jenis_pasien: "rawat-inap",
    tempat_insiden: "penyakit-dalam",
    unit: "laboratorium",
    akibat: "cedera-ringan",
    tindakan_segera: "Evaluasi dilakukan segera setelah ditemukan.",
    tindakan_oleh: { dokter: true, perawat: false, petugas_lain: true },
    pernah_terjadi: false,
    jenis_insiden_output: "KTC",
    skp_output: "SKP 3",
    mdp_output: "MDP 10",
    keterangan: "Revisi Mutu",
  },
];

const pad = (value: number) => value.toString().padStart(2, "0");

const formatDateInput = (value?: string | null) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const formatTimeInput = (value?: string | null) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return "00:00";
  }
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const mapCategory = (
  category?: APIIncidentCategory | null
): Incident["jenis_insiden_output"] => {
  switch (category) {
    case "KTD":
      return "KTD";
    case "KTC":
      return "KTC";
    case "KNC":
      return "KNC";
    case "KPCS":
      return "KPCS";
    case "SENTINEL":
      return "Sentinel";
    default:
      return "KTD";
  }
};

const formatSkp = (skp?: string | null): Incident["skp_output"] => {
  if (!skp) return "SKP 1";
  const number = skp.replace(/[^0-9]/g, "") || "1";
  return (`SKP ${number}` as Incident["skp_output"]);
};

const formatMdp = (mdp?: string | null): Incident["mdp_output"] => {
  if (!mdp) return "MDP 1";
  const number = mdp.replace(/[^0-9]/g, "") || "1";
  return (`MDP ${number}` as Incident["mdp_output"]);
};

const mapReporter = (type?: string | null): Incident["pelapor"] => {
  switch (type) {
    case "dokter":
      return "dokter";
    case "perawat":
      return "perawat";
    case "pasien":
      return "pasien";
    case "keluarga":
      return "keluarga";
    case "pengunjung":
      return "pengunjung";
    case "petugas":
      return "petugas-lain";
    default:
      return "lain";
  }
};

const mapKeterangan = (incident: APIIncident): Incident["keterangan"] => {
  if (incident.status === "MUTU_REVIEWED") return "Revisi Mutu";
  if (incident.status === "PJ_REVIEWED") return "Revisi Unit";
  return "Klasifikasi AI";
};

const mapOutcome = (value?: string | null): Incident["akibat"] => {
  switch (value) {
    case "kematian":
      return "kematian";
    case "berat":
      return "cedera-berat";
    case "sedang":
      return "cedera-sedang";
    case "ringan":
      return "cedera-ringan";
    default:
      return "tidak-cedera";
  }
};

const mapResponderRoles = (roles?: string[] | null) => {
  const normalized = roles?.map((role) => role.toLowerCase()) ?? [];
  return {
    dokter: normalized.includes("dokter"),
    perawat: normalized.includes("perawat"),
    petugas_lain:
      normalized.includes("petugas-lainnya") ||
      normalized.includes("tim") ||
      normalized.includes("petugas"),
  };
};

const mapIncidentSubject = (
  subject?: string | null
): Incident["insiden_terjadi_pada"] => {
  return subject === "pasien" ? "pasien" : "lain";
};

const mapPatientType = (
  context?: string | null
): Incident["jenis_pasien"] => {
  if (context === "rawat-inap") return "rawat-inap";
  if (context === "ugd") return "ugd";
  if (context === "rawat-jalan") return "rawat-jalan";
  return "lain";
};

const mapApiIncidentToUi = (api: APIIncident): Incident => {
  const occurredAt = api.occurred_at;
  const admissionAt = api.admission_at;
  const kategori =
    api.final_category ?? api.mutu_decision ?? api.pj_decision ?? api.predicted_category;
  const jenisInsiden = mapCategory(kategori);
  const pelapor = mapReporter(api.reporter_type ?? undefined);
  const tindakanOleh = mapResponderRoles(api.responder_roles);
  const pernahTerjadi = Boolean(api.has_similar_event);

  return {
    id: api.id,
    nama: api.patient_name || `Pasien ${api.id}`,
    no_rm: api.patient_identifier || `RM-${api.id.toString().padStart(4, "0")}`,
    umur: api.age ?? 0,
    kelompok_usia: api.age_group ?? "dewasa",
    jenis_kelamin: (api.gender === "p" ? "P" : "L"),
    penanggung_biaya: (api.payer_type as Incident["penanggung_biaya"]) || "umum",
    tanggal_masuk: formatDateInput(admissionAt ?? occurredAt),
    tanggal_insiden: formatDateInput(occurredAt),
    waktu_insiden: formatTimeInput(occurredAt),
    kronologi_insiden: api.free_text_description,
    pelapor,
    insiden_terjadi_pada: mapIncidentSubject(api.incident_subject),
    jenis_pasien: mapPatientType(api.patient_context),
    tempat_insiden: api.incident_place ?? "lain",
    unit: api.incident_place ?? "lain",
    akibat: mapOutcome(api.harm_indicator),
    tindakan_segera: api.immediate_action ?? "-",
    tindakan_oleh: tindakanOleh,
    pernah_terjadi: pernahTerjadi,
    kapan_terjadi: pernahTerjadi ? formatDateInput(admissionAt ?? occurredAt) : undefined,
    langkah_pencegahan: api.mutu_notes ?? api.pj_notes ?? undefined,
    jenis_insiden_output: jenisInsiden,
    skp_output: formatSkp(api.skp_code),
    mdp_output: formatMdp(api.mdp_code),
    keterangan: mapKeterangan(api),
  };
};


/* =========================================================
   BADGE HELPER
========================================================= */
const getNoteColor = (ket: string) => {
  if (ket === "Klasifikasi AI") return "info";
  if (ket === "Revisi Unit") return "warning";
  if (ket === "Revisi Mutu") return "error";
  return "info";
};

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function BasicTableOne({ search }: { search: string }) {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  const [selected, setSelected] = useState<Incident | null>(null);

  const [editForm, setEditForm] = useState({
    id: 0,
    jenis_insiden_output: "KTD" as Incident["jenis_insiden_output"],
    skp_output: "SKP 1" as Incident["skp_output"],
    mdp_output: "MDP 1" as Incident["mdp_output"],
  });

  const detailModal = useModal();
  const editModal = useModal();

  /* =============================
     FILTERING (SEARCH)
  ============================= */
  const filteredIncidents = incidents.filter((row) => {
    const s = search.toLowerCase();
    return (
      row.nama.toLowerCase().includes(s) ||
      row.no_rm.toLowerCase().includes(s) ||
      row.jenis_insiden_output.toLowerCase().includes(s) ||
      row.skp_output.toLowerCase().includes(s) ||
      row.mdp_output.toLowerCase().includes(s)
    );
  });

  /* =============================
     DOWNLOAD CSV LISTENER
  ============================= */
  useEffect(() => {
    let cancelled = false;
    const fetchFromApi = async () => {
      try {
        const apiData = await listIncidents({ per_page: 100 });
        if (cancelled) return;
        if (apiData.items && apiData.items.length > 0) {
          setIncidents(apiData.items.map(mapApiIncidentToUi));
        }
      } catch (error) {
        console.error("Failed to fetch incidents", error);
      }
    };
    fetchFromApi();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      if (incidents.length === 0) return;

      const header = Object.keys(incidents[0]).join(",");
      const body = incidents.map((r) => Object.values(r).join(",")).join("\n");
      const csv = "data:text/csv;charset=utf-8," + header + "\n" + body;

      const link = document.createElement("a");
      link.href = encodeURI(csv);
      link.download = "data_insiden.csv";
      link.click();
    };

    window.addEventListener("download-table-csv", handler);
    return () =>
      window.removeEventListener("download-table-csv", handler);
  }, [incidents]);

  /* =============================
     OPEN DETAIL
  ============================= */
  const openDetail = (row: Incident) => {
    setSelected(row);
    detailModal.openModal();
  };

  /* =============================
     OPEN EDIT
  ============================= */
  const openEdit = (row: Incident) => {
    setSelected(row);
    setEditForm({
      id: row.id,
      jenis_insiden_output: row.jenis_insiden_output,
      skp_output: row.skp_output,
      mdp_output: row.mdp_output,
    });
    editModal.openModal();
  };

  /* =============================
     ON CHANGE EDIT
  ============================= */
  const onChangeEdit = (
    field: "jenis_insiden_output" | "skp_output" | "mdp_output",
    value: string
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]:
        field === "jenis_insiden_output"
          ? (value as Incident["jenis_insiden_output"])
          : field === "skp_output"
            ? (value as Incident["skp_output"])
            : (value as Incident["mdp_output"]),
    }));
  };

  /* =============================
     SUBMIT EDIT
  ============================= */
  const onSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();

    setIncidents((prev) =>
      prev.map((it) =>
        it.id === editForm.id
          ? {
            ...it,
            jenis_insiden_output: editForm.jenis_insiden_output,
            skp_output: editForm.skp_output,
            mdp_output: editForm.mdp_output,
          }
          : it
      )
    );

    setSelected((s) =>
      s && s.id === editForm.id
        ? {
          ...s,
          jenis_insiden_output: editForm.jenis_insiden_output,
          skp_output: editForm.skp_output,
          mdp_output: editForm.mdp_output,
        }
        : s
    );

    editModal.closeModal();
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-full overflow-x-auto">
        <Table>

          {/* =============================
              HEADER
          ============================= */}
          <TableHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <TableRow>
              {[
                "No",
                "Tanggal",
                "Nama",
                "Jenis Kelamin",
                "Usia",
                "Jenis",
                "SKP",
                "MDP",
                "Ket",
                "Aksi",
              ].map((head) => (
                <TableCell
                  key={head}
                  isHeader
                  className={`px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 ${head === "Aksi" ? "text-center" : "text-start"
                    }`}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* =============================
              BODY
          ============================= */}
          <TableBody>

            {filteredIncidents.map((row, index) => (
              <TableRow key={row.id} className="text-sm">

                <TableCell className="px-4 py-2 text-gray-700 dark:text-gray-200">
                  {index + 1}
                </TableCell>

                <TableCell className="px-4 py-2 text-gray-700 dark:text-gray-200">
                  {new Date(row.tanggal_insiden).toLocaleDateString("id-ID")}
                </TableCell>

                <TableCell className="px-4 py-2 text-gray-700 dark:text-gray-200">
                  {row.nama}
                </TableCell>

                <TableCell className="px-4 py-2 text-gray-700 dark:text-gray-200">
                  {row.jenis_kelamin}
                </TableCell>

                <TableCell className="px-4 py-2 text-gray-700 dark:text-gray-200">
                  {row.umur}
                </TableCell>

                <TableCell className="px-4 py-2 text-gray-700 dark:text-gray-200">
                  {row.jenis_insiden_output}
                </TableCell>

                <TableCell className="px-4 py-2 text-gray-700 dark:text-gray-200">
                  {row.skp_output}
                </TableCell>

                <TableCell className="px-4 py-2 text-gray-700 dark:text-gray-200">
                  {row.mdp_output}
                </TableCell>

                <TableCell className="px-4 py-2">
                  <Badge size="sm" color={getNoteColor(row.keterangan)}>
                    {row.keterangan}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <Button size="sm" onClick={() => openDetail(row)}>
                      Detail
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                      Edit
                    </Button>
                  </div>
                </TableCell>

              </TableRow>
            ))}

          </TableBody>

        </Table>
      </div>

      {/* =========================================================
          MODAL DETAIL
      ========================================================= */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={detailModal.closeModal}
        className="max-w-[750px] w-full m-4"
      >
        <div className="flex flex-col max-h-[85vh] rounded-2xl bg-white dark:bg-gray-900">

          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold dark:text-gray-200">Detail Insiden #{selected?.id}</h3>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto">

            {selected && (
              <>
                {/* Input styling patch */}
                <style>
                  {`
                  input[disabled], textarea[disabled] {
                    color: black !important;
                  }
                  .dark input[disabled], .dark textarea[disabled] {
                    color: white !important;
                  }
                `}
                </style>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nama</Label>
                    <Input disabled value={selected.nama} />
                  </div>
                  <div>
                    <Label>No RM</Label>
                    <Input disabled value={selected.no_rm} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Jenis Kelamin</Label>
                    <Input
                      disabled
                      value={
                        selected.jenis_kelamin === "L"
                          ? "Laki-laki"
                          : "Perempuan"
                      }
                    />
                  </div>
                  <div>
                    <Label>Umur</Label>
                    <Input disabled value={selected.umur} />
                  </div>
                  <div>
                    <Label>Kelompok Usia</Label>
                    <Input disabled value={selected.kelompok_usia} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Tanggal Masuk</Label>
                    <Input disabled value={selected.tanggal_masuk} />
                  </div>
                  <div>
                    <Label>Tanggal Insiden</Label>
                    <Input disabled value={selected.tanggal_insiden} />
                  </div>
                  <div>
                    <Label>Waktu Insiden</Label>
                    <Input disabled value={selected.waktu_insiden} />
                  </div>
                </div>

                <div>
                  <Label>Kronologi</Label>
                  <TextArea disabled rows={4} value={selected.kronologi_insiden} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Pelapor</Label>
                    <Input disabled value={selected.pelapor} />
                  </div>
                  <div>
                    <Label>Insiden Terjadi Pada</Label>
                    <Input disabled value={selected.insiden_terjadi_pada} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Jenis Pasien</Label>
                    <Input disabled value={selected.jenis_pasien} />
                  </div>
                  <div>
                    <Label>Tempat Insiden</Label>
                    <Input disabled value={selected.tempat_insiden} />
                  </div>
                </div>

                <div>
                  <Label>Unit</Label>
                  <Input disabled value={selected.unit} />
                </div>

                <div>
                  <Label>Akibat</Label>
                  <Input disabled value={selected.akibat} />
                </div>

                <div>
                  <Label>Tindakan Segera</Label>
                  <TextArea
                    disabled
                    rows={4}
                    value={selected.tindakan_segera}
                  />
                </div>

                <div>
                  <Label>Dilakukan Oleh</Label>
                  <Input
                    disabled
                    value={[
                      selected.tindakan_oleh.dokter && "Dokter",
                      selected.tindakan_oleh.perawat && "Perawat",
                      selected.tindakan_oleh.petugas_lain && "Petugas Lain",
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  />
                </div>

                {selected.pernah_terjadi && (
                  <>
                    <div>
                      <Label>Kapan Terjadi</Label>
                      <Input disabled value={selected.kapan_terjadi} />
                    </div>
                    <div>
                      <Label>Langkah Pencegahan</Label>
                      <TextArea
                        disabled
                        rows={3}
                        value={selected.langkah_pencegahan}
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Jenis Insiden</Label>
                    <Input disabled value={selected.jenis_insiden_output} />
                  </div>
                  <div>
                    <Label>SKP</Label>
                    <Input disabled value={selected.skp_output} />
                  </div>
                  <div>
                    <Label>MDP</Label>
                    <Input disabled value={selected.mdp_output} />
                  </div>
                </div>

              </>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <Button variant="outline" onClick={detailModal.closeModal}>
              Tutup
            </Button>
          </div>

        </div>
      </Modal>

      {/* =========================================================
          MODAL EDIT
      ========================================================= */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        className="max-w-[600px]"
      >
        <div className="p-6 lg:p-10 bg-white dark:bg-gray-900 rounded-2xl">
          <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">
            Edit Klasifikasi Insiden
          </h3>

          <form onSubmit={onSubmitEdit} className="space-y-4">

            {/* JENIS INSIDEN */}
            <div>
              <Label>Jenis Insiden</Label>
              <select
                className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                value={editForm.jenis_insiden_output}
                onChange={(e) =>
                  onChangeEdit("jenis_insiden_output", e.target.value)
                }
              >
                <option value="KNC">KNC</option>
                <option value="KTD">KTD</option>
                <option value="KTC">KTC</option>
                <option value="KPCS">KPCS</option>
                <option value="Sentinel">Sentinel</option>
              </select>
            </div>

            {/* SKP */}
            <div>
              <Label>SKP</Label>
              <select
                className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                value={editForm.skp_output}
                onChange={(e) => onChangeEdit("skp_output", e.target.value)}
              >
                <option value="SKP 1">SKP 1</option>
                <option value="SKP 2">SKP 2</option>
                <option value="SKP 3">SKP 3</option>
                <option value="SKP 4">SKP 4</option>
                <option value="SKP 5">SKP 5</option>
                <option value="SKP 6">SKP 6</option>
              </select>
            </div>

            {/* MDP */}
            <div>
              <Label>MDP</Label>
              <select
                className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                value={editForm.mdp_output}
                onChange={(e) => onChangeEdit("mdp_output", e.target.value)}
              >
                {Array.from({ length: 17 }).map((_, i) => (
                  <option key={i} value={`MDP ${i + 1}`}>
                    MDP {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={editModal.closeModal}>
                Batal
              </Button>

              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Simpan
              </button>
            </div>

          </form>
        </div>
      </Modal>

    </div>
  );
}
