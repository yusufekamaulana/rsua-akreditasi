import { useMemo, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "./Label";
import Input from "./input/InputField";
import Select from "./Select";
import { TimeIcon } from "../../icons";
import DatePicker from "./date-picker";
import TextArea from "./input/TextArea";
import Button from "../ui/button/Button";
import {
  createIncident,
  submitIncident,
  type IncidentCreate,
  type IncidentRead,
} from "../../services/incidents";

const toIsoDate = (date: string, time?: string) => {
  if (!date) return undefined;
  const timePart =
    time && time.length > 0 ? (time.length === 5 ? `${time}:00` : time) : "00:00";
  return new Date(`${date}T${timePart}`).toISOString();
};

const toBoolean = (value: string) => {
  if (value === "ya") return true;
  if (value === "tidak") return false;
  return undefined;
};

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
    { value: "bayi", label: "Bayi (0-1 tahun)" },
    { value: "balita", label: "Balita (1-5 tahun)" },
    { value: "anak", label: "Anak (5-11 tahun)" },
    { value: "remaja", label: "Remaja (12-17 tahun)" },
    { value: "dewasa", label: "Dewasa (18-59 tahun)" },
    { value: "lansia", label: "Lansia (60+ tahun)" },
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
    { value: "obsgyn", label: "Obstetric Gynekologi" },
    { value: "tht", label: "THT" },
    { value: "mata", label: "Mata" },
    { value: "saraf", label: "Saraf" },
    { value: "anestesi", label: "Anestesi" },
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

  const [patientName, setPatientName] = useState("");
  const [patientIdentifier, setPatientIdentifier] = useState("");
  const [age, setAge] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [payerType, setPayerType] = useState("");
  const [reporterType, setReporterType] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [incidentPlace, setIncidentPlace] = useState("");
  const [unitValue, setUnitValue] = useState("");
  const [harmIndicator, setHarmIndicator] = useState("");
  const [hasSimilarEvent, setHasSimilarEvent] = useState("");
  const [message, setMessage] = useState("");
  const [immediateAction, setImmediateAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<IncidentRead | null>(null);

  const resetForm = () => {
    setPatientName("");
    setPatientIdentifier("");
    setAge("");
    setAgeGroup("");
    setGenderValue("");
    setPayerType("");
    setReporterType("");
    setAdmissionDate("");
    setIncidentDate("");
    setIncidentTime("");
    setIncidentPlace("");
    setUnitValue("");
    setHarmIndicator("");
    setHasSimilarEvent("");
    setMessage("");
    setImmediateAction("");
  };

  const buildPayload = (): IncidentCreate | null => {
    if (!message || message.trim().length < 10) {
      setError("Kronologi minimal 10 karakter.");
      return null;
    }
    const parsedAge = age ? parseInt(age, 10) : undefined;
    const numericAge = Number.isNaN(parsedAge) ? undefined : parsedAge;
    return {
      patient_name: patientName || null,
      patient_identifier: patientIdentifier || null,
      reporter_type: reporterType || null,
      age: numericAge ?? null,
      age_group: ageGroup || null,
      gender: genderValue || null,
      payer_type: payerType || null,
      admission_at: admissionDate ? toIsoDate(admissionDate) : undefined,
      occurred_at: toIsoDate(incidentDate, incidentTime),
      incident_place: incidentPlace || null,
      incident_subject: "pasien",
      patient_context: null,
      responder_roles: null,
      immediate_action: immediateAction || null,
      has_similar_event: toBoolean(hasSimilarEvent),
      department_id: undefined,
      free_text_description: message,
      harm_indicator: harmIndicator || null,
    };
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setResult(null);
    const payload = buildPayload();
    if (!payload) return;
    setLoading(true);
    try {
      const created = await createIncident(payload);
      const submitted = await submitIncident(created.id);
      setResult(submitted);
      setSuccess("Insiden berhasil disimpan dan diklasifikasikan.");
      resetForm();
    } catch (err: any) {
      setError(err?.message ?? "Gagal mengirim data insiden.");
    } finally {
      setLoading(false);
    }
  };

  const classification = useMemo(() => {
    if (!result) return null;
    return {
      jenis: result.final_category ?? result.predicted_category ?? "-",
      skp: result.skp_code ?? "-",
      mdp: result.mdp_code ?? "-",
      confidence: result.predicted_confidence
        ? `${Math.round(result.predicted_confidence * 100)}%`
        : null,
    };
  }, [result]);

  return (
    <ComponentCard title="Klasifikasi Jenis Kejadian">
      <div className="space-y-6">
        <Label>Nama</Label>
        <Input
          placeholder="Nama Pasien"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />

        <Label>No. Rekam Medis</Label>
        <Input
          placeholder="Nomor RM"
          value={patientIdentifier}
          onChange={(e) => setPatientIdentifier(e.target.value)}
        />

        <Label>Reporter</Label>
        <Select
          options={pelapor}
          placeholder="Pilih Pelapor"
          value={reporterType}
          onChange={setReporterType}
        />

        <Label>Umur</Label>
        <Input
          type="number"
          placeholder="Umur"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <Label>Kelompok Usia</Label>
        <Select
          options={kelompokUsiaList}
          placeholder="Pilih Kelompok Usia"
          value={ageGroup}
          onChange={setAgeGroup}
        />

        <Label>Jenis Kelamin</Label>
        <Select
          options={gender}
          placeholder="Pilih Jenis Kelamin"
          value={genderValue}
          onChange={setGenderValue}
        />

        <Label>Penanggung Biaya</Label>
        <Select
          options={penanggung}
          placeholder="Pilih Penanggung"
          value={payerType}
          onChange={setPayerType}
        />

        <DatePicker
          id="tgl-masuk"
          label="Tanggal Masuk"
          placeholder="Tanggal Masuk"
          onChange={(_, dateStr) => setAdmissionDate(dateStr ?? "")}
        />

        <DatePicker
          id="tgl-insiden"
          label="Tanggal Insiden"
          placeholder="Tanggal Insiden"
          onChange={(_, dateStr) => setIncidentDate(dateStr ?? "")}
        />

        <Label>Waktu Insiden</Label>
        <div className="relative">
          <Input
            type="time"
            value={incidentTime}
            onChange={(e) => setIncidentTime(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            <TimeIcon className="size-6" />
          </span>
        </div>

        <Label>Kronologi Insiden</Label>
        <TextArea
          rows={6}
          value={message}
          onChange={setMessage}
          placeholder="Ceritakan kronologi kejadian..."
        />

        <Label>Tempat Insiden</Label>
        <Select
          options={tempatInsiden}
          placeholder="Pilih Tempat"
          value={incidentPlace}
          onChange={setIncidentPlace}
        />

        <Label>Unit/Departemen Terkait</Label>
        <Select
          options={unitList}
          placeholder="Pilih Unit/Departemen"
          value={unitValue}
          onChange={setUnitValue}
        />

        <Label>Akibat Insiden</Label>
        <Select
          options={akibatInsiden}
          placeholder="Pilih Akibat"
          value={harmIndicator}
          onChange={setHarmIndicator}
        />

        <Label>Tindakan Segera Setelah Kejadian</Label>
        <TextArea
          rows={4}
          value={immediateAction}
          onChange={setImmediateAction}
          placeholder="Tuliskan tindakan..."
        />

        <Label>Apakah kejadian serupa pernah terjadi?</Label>
        <Select
          options={[
            { value: "ya", label: "Ya" },
            { value: "tidak", label: "Tidak" },
          ]}
          placeholder="Pilih"
          value={hasSimilarEvent}
          onChange={setHasSimilarEvent}
        />

        {error && <p className="text-sm text-error-500">{error}</p>}
        {success && <p className="text-sm text-success-600">{success}</p>}

        <div className="pt-4 flex justify-end">
          <Button
            className="px-6 py-2 bg-indigo-600 text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Klasifikasi"}
          </Button>
        </div>

        {classification && (
          <div className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
            <h3 className="text-lg font-semibold mb-5 text-indigo-700 text-center">
              Hasil Klasifikasi
            </h3>

            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <Label>Jenis Kejadian</Label>
                <button
                  disabled
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold w-52 h-12"
                >
                  {classification.jenis}
                </button>
              </div>

              <div className="text-center">
                <Label>MDP</Label>
                <button
                  disabled
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold w-52 h-12"
                >
                  {classification.mdp}
                </button>
              </div>

              <div className="text-center">
                <Label>SKP</Label>
                <button
                  disabled
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold w-52 h-12"
                >
                  {classification.skp}
                </button>
              </div>
            </div>

            {classification.confidence && (
              <p className="mt-4 text-center text-sm text-gray-600">
                Akurasi model {classification.confidence}
              </p>
            )}
          </div>
        )}
      </div>
    </ComponentCard>
  );
}
