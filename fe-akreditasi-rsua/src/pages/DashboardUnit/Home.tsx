import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import IncidentTypePieChart from "../../components/dashboard/IncidentTypePieChart";
import SKPDistributionPieChart from "../../components/dashboard/SKPDistributionPieChart";
import MDPBarChart from "../../components/dashboard/MDPBarChart";
import IncidentTrendChart from "../../components/dashboard/IncidentLineChart";
import KPI from "../../components/dashboard/KPI";
import {
  fetchMutuDashboard,
  type MutuDashboardResponse,
} from "../../services/dashboard";
import { getCurrentDepartmentId } from "../../utils/auth";

export default function Home() {
  const [dashboardData, setDashboardData] =
    useState<MutuDashboardResponse | null>(null);
  const [unitParam, setUnitParam] = useState("all");

  useEffect(() => {
    const deptId = getCurrentDepartmentId();
    if (deptId) {
      setUnitParam(deptId);
    } else {
      console.warn(
        "Department ID tidak ditemukan pada token. Menggunakan agregasi 'all'."
      );
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await fetchMutuDashboard(unitParam);
        if (!active) return;
        setDashboardData(data);
      } catch (err) {
        if (!active) return;
        console.error("Gagal memuat dashboard unit", err);
        setDashboardData(null);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [unitParam]);

  const unitTitle = useMemo(() => {
    if (dashboardData?.unit) return dashboardData.unit;
    return "Unit";
  }, [dashboardData?.unit]);

  return (
    <>
      <PageMeta
        title="Rumah Sakit Universitas Airlangga"
        description="Rumah Sakit Universitas Airlangga"
      />
      <h1 className="text-lg text-center font-bold mb-4 text-gray-800 dark:text-gray-100">
        Unit {unitTitle}
      </h1>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* KPI Section */}
        <div className="col-span-12 xl:col-span-12">
          <KPI
            totalIncidents={dashboardData?.total_insiden}
            jenisKejadian={dashboardData?.jenis_kejadian}
            riskLevel={dashboardData?.hospital_risk}
          />
        </div>

        {/* === Gabungan Pie Chart Responsif === */}
        <div className="col-span-12 xl:col-span-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-colors duration-300">
            <h2 className="text-center text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Distribusi Insiden
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
