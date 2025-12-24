import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import DatePicker from "../../components/form/date-picker";

export default function BasicTables() {
  const [search, setSearch] = useState("");

  // Modal Download
  const [openDownload, setOpenDownload] = useState(false);

  // Range tanggal
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const submitDownload = () => {
    window.dispatchEvent(
      new CustomEvent("download-table-csv", {
        detail: { fromDate, toDate },
      })
    );
    setOpenDownload(false);
  };

  return (
    <>
      <PageMeta
        title="Rumah Sakit Universitas Airlangga"
        description="Rumah Sakit Universitas Airlangga"
      />

      <PageBreadcrumb pageTitle="Data Kejadian" />

      <div className="space-y-6">

        {/* SEARCH + DOWNLOAD */}
        <div className="flex items-center justify-between gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pasien, RM, jenis insiden..."
            className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                       dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
          />

          <Button variant="outline" onClick={() => setOpenDownload(true)}>
            Download CSV
          </Button>
        </div>

        {/* TABLE */}
        <BasicTableOne search={search} />
      </div>

      {/* =============================
    MODAL DOWNLOAD CSV
============================= */}
      <Modal
        isOpen={openDownload}
        onClose={() => setOpenDownload(false)}
        className="max-w-[450px]"
      >
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
            Pilih Rentang Tanggal
          </h3>

          <div className="space-y-4">

            {/* FROM DATE */}
            <DatePicker
              id="from-date"
              label="Dari Tanggal"
              placeholder="Pilih tanggal mulai"
              onChange={(d, v) => setFromDate(v)}
            />

            {/* TO DATE */}
            <DatePicker
              id="to-date"
              label="Sampai Tanggal"
              placeholder="Pilih tanggal akhir"
              onChange={(d, v) => setToDate(v)}
            />

          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setOpenDownload(false)}>
              Batal
            </Button>
            <Button onClick={submitDownload}>Download</Button>
          </div>
        </div>
      </Modal>

    </>
  );
}
