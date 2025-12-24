import PageMeta from "../../components/common/PageMeta";
import IncidentTypePieChart from "../../components/dashboard/IncidentTypePieChart";
import SKPDistributionPieChart from "../../components/dashboard/SKPDistributionPieChart";
import MDPBarChart from "../../components/dashboard/MDPBarChart";
import IncidentTrendChart from "../../components/dashboard/IncidentLineChart";
import KPIHospital from "../../components/dashboard/KPIHospital";
import HospitalAlert from "../../components/dashboard/HospitalAlert";
import UnitSelector from "../../components/dashboard/UnitSelector";
import { useEffect, useMemo, useState } from "react";
import {
  fetchMutuDashboard,
  type MutuDashboardResponse,
} from "../../services/dashboard";

export default function HomeMutu() {
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [dashboardData, setDashboardData] =
    useState<MutuDashboardResponse | null>(null);

  const unitParam =
    selectedUnit.toLowerCase() === "all" || selectedUnit.length === 0
      ? "all"
      : selectedUnit;

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await fetchMutuDashboard(unitParam);
        if (!active) return;
        setDashboardData(data);
      } catch (err) {
        if (!active) return;
        console.error("Gagal memuat data dashboard mutu", err);
        setDashboardData(null);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [unitParam]);

  const unitLabel = useMemo(() => {
    if (dashboardData?.unit) return dashboardData.unit;
    return selectedUnit;
  }, [dashboardData?.unit, selectedUnit]);

  const unitLabelDisplay =
    unitLabel.toLowerCase() === "all" ? "Semua Unit" : unitLabel;

  return (
    <>
      <PageMeta
        title="Rumah Sakit Universitas Airlangga"
        description="Rumah Sakit Universitas Airlangga"
      />
      <h1 className="text-lg text-center font-bold mb-4 text-gray-800 dark:text-gray-100">
        PJ Mutu
      </h1>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* KPI Section */}
        <div className="col-span-12 xl:col-span-12">
          <HospitalAlert
            hospitalRisk={dashboardData?.hospital_risk}
            units={dashboardData?.units_risk}
          />
        </div>

        <div className="col-span-12">
          <UnitSelector
            selectedUnit={unitLabel}
            units={dashboardData?.unit_list}
            onChange={setSelectedUnit}
          />
        </div>

        {/* KPI Section */}
        <div className="col-span-12 xl:col-span-12">
          <KPIHospital
            totalIncidents={dashboardData?.total_insiden}
            jenisKejadian={dashboardData?.jenis_kejadian}
          />
        </div>
        

        {/* === Gabungan Pie Chart Responsif === */}
        <div className="col-span-12 xl:col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-colors duration-300">
            <h2 className="text-center text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Distribusi Insiden ({unitLabelDisplay})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart 1 */}
              <div>
                <IncidentTypePieChart
                  jenisKejadian={dashboardData?.jenis_kejadian}
                />
              </div>

              {/* Pie Chart 2 */}
              <div>
                <SKPDistributionPieChart skpData={dashboardData?.skp} />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-1 gap-6">
              {/* Pie Chart 1 */}
              <div>
                <MDPBarChart mdpData={dashboardData?.mdp} />
              </div>
            </div>
          </div>
        </div>

        {/* === Line Chart === */}
        <div className="col-span-12 xl:col-span-12">
          <IncidentTrendChart unit={unitParam} />
        </div>
      </div>
    </>
  );
}
