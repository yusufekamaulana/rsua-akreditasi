import Klasifikasi from "../../components/form/FormKlasifikasi";
import PageMeta from "../../components/common/PageMeta";

export default function FormElements() {
  return (
    <div>
      <PageMeta
        title="Rumah Sakit Universitas Airlanga"
        description="Rumah Sakit Universitas Airlanga"
      />
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <Klasifikasi />
        </div>
      </div>
    </div>
  );
}
