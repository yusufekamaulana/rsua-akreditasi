import { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "./Label";
import Input from "./input/InputField";
import Select from "./Select";
import { TimeIcon } from "../../icons";
import DatePicker from "./date-picker";
import TextArea from "./input/TextArea";
import Button from "../ui/button/Button";

export default function Klasifikasi() {
  const gender = [
    { value: "l", label: "Laki-Laki" },
    { value: "p", label: "Perempuan" },
  ];

  const penanggung = [
    { value: "umum", label: "Umum" },
    { value: "bpjs-mandiri", label: "BPJS Mandiri" },
    { value: "sktm", label: "SKTM" },
  ];

  const kelompokUsiaList = [
    { value: "bayi", label: "Bayi (0–1 tahun)" },
    { value: "balita", label: "Balita (1–5 tahun)" },
    { value: "anak", label: "Anak (5–11 tahun)" },
    { value: "remaja", label: "Remaja (12–17 tahun)" },
    { value: "dewasa", label: "Dewasa (18–59 tahun)" },
    { value: "lansia", label: "Lansia (60+ tahun)" },
  ];

  const skpList = [
    { value: "skp1", label: "SKP 1: Identifikasi Pasien" },
    { value: "skp2", label: "SKP 2: Komunikasi Efektif" },
    { value: "skp3", label: "SKP 3: Keamanan Obat" },
    { value: "skp4", label: "SKP 4: Keselamatan Operasi" },
    { value: "skp5", label: "SKP 5: Pencegahan Infeksi" },
    { value: "skp6", label: "SKP 6: Pencegahan Jatuh" },
  ];

  const mdpList = [
    { value: "mdp1", label: "MDP 1: Melakukan praktik keprofesian tidak kompeten" },
    { value: "mdp2", label: "MDP 2: Tidak merujuk pasien kepada tenaga medis yang kompeten" },
    { value: "mdp3", label: "MDP 3: Merujuk pasien kepada tenaga medis/tidak kompeten" },
    { value: "mdp4", label: "MDP 4: Mengabaikan tanggung jawab profesi" },
    { value: "mdp5", label: "MDP 5: Menghentikan kehamilan tidak sesuai ketentuan" },
    { value: "mdp6", label: "MDP 6: Penyalahgunaan kewenangan profesi" },
    { value: "mdp7", label: "MDP 7: Penyalahgunaan alkohol/obat terlarang" },
    { value: "mdp8", label: "MDP 8: Penipuan / penjelasan tidak jujur" },
    { value: "mdp9", label: "MDP 9: Membuka rahasia medis tanpa pembenaran" },
    { value: "mdp10", label: "MDP 10: Perbuatan tidak pantas / unsur seksual" },
    { value: "mdp11", label: "MDP 11: Menolak/menghentikan tindakan tanpa alasan" },
    { value: "mdp12", label: "MDP 12: Over-treatment" },
    { value: "mdp13", label: "MDP 13: Meresepkan obat tidak sesuai perawatan" },
    { value: "mdp14", label: "MDP 14: Tidak membuat / menyimpan rekam medis" },
    { value: "mdp15", label: "MDP 15: Keterangan medis tanpa pemeriksaan" },
    { value: "mdp16", label: "MDP 16: Turut serta melakukan penyiksaan" },
    { value: "mdp17", label: "MDP 17: Mengiklankan diri & perang tarif" },
  ];

  const pelapor = [
    { value: "dokter", label: "Dokter" },
    { value: "perawat", label: "Perawat" },
    { value: "petugas", label: "Petugas Lain" },
    { value: "pasien", label: "Pasien" },
    { value: "keluarga", label: "Keluarga / Pendamping" },
    { value: "pengunjung", label: "Pengunjung" },
    { value: "lain", label: "Lainnya" },
  ];

  const tempatInsiden = [
    { value: "penyakit-dalam", label: "Penyakit dalam dan subspesialisasinya" },
    { value: "anak", label: "Anak dan subspesialisasinya" },
    { value: "bedah", label: "Bedah dan subspesialisasinya" },
    { value: "obsgyn", label: "Obstetric gynekologi" },
    { value: "tht", label: "THT" },
    { value: "mata", label: "Mata" },
    { value: "saraf", label: "Saraf" },
    { value: "anestesi", label: "Anastesi" },
    { value: "kulit-kelamin", label: "Kulit dan kelamin" },
    { value: "jantung", label: "Jantung" },
    { value: "paru", label: "Paru" },
    { value: "jiwa", label: "Jiwa" },
    { value: "lain", label: "Lainnya" },
  ];

  const unitList = [
    { value: "icu", label: "ICU" },
    { value: "poli-rehab-medik", label: "Poli Rehab Medik" },
    { value: "laboratorium", label: "Laboratorium" },
    { value: "irna-5-rsua", label: "IRNA 5 RSUA" },
    { value: "poli-mata", label: "Poli Mata" },
    { value: "rawat-inap", label: "Rawat Inap" },
    { value: "radiologi", label: "Radiologi" },
    { value: "picu", label: "PICU" },
  ];

  const akibatInsiden = [
    { value: "kematian", label: "Kematian" },
    { value: "berat", label: "Cedera Berat" },
    { value: "sedang", label: "Cedera Sedang" },
    { value: "ringan", label: "Cedera Ringan" },
    { value: "tidak-cedera", label: "Tidak Ada Cedera" },
  ];

  // STATE INPUT
  const [riwayat, setRiwayat] = useState("");
  const [message, setMessage] = useState("");
  const [tindakan, setTindakan] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [result, setResult] = useState({
    jenisKejadian: "",
    mdp: "",
    skp: ""
  });


  const handleSubmit = () => {
    setResult({
      jenisKejadian: "Kejadian Tidak Diharapkan",
      mdp: mdpList[0].label.split(":")[0],
      skp: skpList[0].label.split(":")[0]
    });
    setSubmitted(true);
  };


  return (
    <ComponentCard title="Klasifikasi Jenis Kejadian">
      <div className="space-y-6">

        <Label>Nama</Label>
        <Input placeholder="Nama Pasien" />

        <Label>No. Rekam Medis</Label>
        <Input placeholder="Nomor RM" />

        <Label>Umur</Label>
        <Input type="number" placeholder="Umur" />

        <Label>Kelompok Usia</Label>
        <Select options={kelompokUsiaList} placeholder="Pilih Kelompok Usia" onChange={(v) => { }} />

        <Label>Jenis Kelamin</Label>
        <Select options={gender} placeholder="Pilih Jenis Kelamin" onChange={(v) => { }} />

        <Label>Penanggung Biaya</Label>
        <Select options={penanggung} placeholder="Pilih Penanggung" onChange={(v) => { }} />

        <DatePicker
          id="tgl-masuk"
          label="Tanggal Masuk"
          placeholder="Tanggal Masuk"
          onChange={(d, v) => console.log(v)}
        />

        <DatePicker
          id="tgl-insiden"
          label="Tanggal Insiden"
          placeholder="Tanggal Insiden"
          onChange={(d, v) => console.log(v)}
        />

        <Label>Waktu Insiden</Label>
        <div className="relative">
          <Input type="time" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            <TimeIcon className="size-6" />
          </span>
        </div>

        <Label>Kronologi Insiden</Label>
        <TextArea rows={6} value={message} onChange={setMessage} placeholder="Ceritakan kronologi kejadian..." />

        {/* <Label>Sasaran Keselamatan Pasien (SKP)</Label>
        <Select options={skpList} placeholder="Pilih SKP" onChange={(v) => { }} />

        <Label>Masalah Disiplin Profesi (MDP)</Label>
        <Select options={mdpList} placeholder="Pilih MDP" onChange={(v) => { }} /> */}

        <Label>Tempat Insiden</Label>
        <Select options={tempatInsiden} placeholder="Pilih Tempat" onChange={(v) => { }} />

        <Label>Unit/Departemen Terkait</Label>
        <Select options={unitList} placeholder="Pilih Unit/Departemen" onChange={(v) => { }} />

        <Label>Akibat Insiden</Label>
        <Select options={akibatInsiden} placeholder="Pilih Akibat" onChange={(v) => { }} />

        <Label>Tindakan Segera Setelah Kejadian</Label>
        <TextArea rows={4} value={tindakan} onChange={setTindakan} placeholder="Tuliskan tindakan..." />

        <Label>Apakah kejadian serupa pernah terjadi?</Label>
        <Select
          options={[
            { value: "ya", label: "Ya" },
            { value: "tidak", label: "Tidak" },
          ]}
          placeholder="Pilih"
          onChange={(v) => setRiwayat(v ?? "")}
        />

        <div className="pt-4 flex justify-end">
          <Button className="px-6 py-2 bg-indigo-600 text-white" onClick={handleSubmit}>
            Klasifikasi
          </Button>
        </div>

        {submitted && (
          <div className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
            <h3 className="text-lg font-semibold mb-5 text-indigo-700 text-center">
              Hasil Klasifikasi
            </h3>

            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <Label>Jenis Kejadian</Label>
                <button
                  disabled
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold w-52 h-12"
                >
                  {result.jenisKejadian}
                </button>
              </div>

              <div className="text-center">
                <Label>MDP</Label>
                <button
                  disabled
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold w-52 h-12"
                >
                  {result.mdp}
                </button>
              </div>

              <div className="text-center">
                <Label>SKP</Label>
                <button
                  disabled
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold w-52 h-12"
                >
                  {result.skp}
                </button>
              </div>
            </div>


          </div>
        )}
      </div>
    </ComponentCard>
  );
}
