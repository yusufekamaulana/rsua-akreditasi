import { http, type APIResponse } from "./http";

export type RiskLevel =
  | "rendah"
  | "sedang"
  | "moderat"
  | "tinggi"
  | "ekstrem"
  | "tidak tersedia";

export type IncidentCategoryKey = "KTD" | "KTC" | "KNC" | "KPCS" | "SENTINEL";

export type MutuDashboardResponse = {
  unit: string;
  total_insiden: number;
  jenis_kejadian: Record<IncidentCategoryKey, number>;
  skp: Record<string, number>;
  mdp: Record<string, number>;
  hospital_risk: RiskLevel;
  units_risk: { name: string; level: RiskLevel }[];
  unit_list: string[];
};

export type TrendGroup = "jenis" | "total" | "mdp" | "skp" | "grading";
export type TrendView = "weekly" | "monthly" | "quarterly" | "yearly";

export type MutuTrendSeries = {
  key: string;
  label: string;
  data: number[];
};

export type MutuTrendResponse = {
  unit: string;
  view: TrendView;
  group: TrendGroup;
  periods: string[];
  series: MutuTrendSeries[];
};

const createEmptyDashboard = (): MutuDashboardResponse => ({
  unit: "All",
  total_insiden: 0,
  jenis_kejadian: {
    KTD: 0,
    KTC: 0,
    KNC: 0,
    KPCS: 0,
    SENTINEL: 0,
  },
  skp: {},
  mdp: {},
  hospital_risk: "rendah",
  units_risk: [],
  unit_list: ["All"],
});

const createEmptyTrend = (
  view: TrendView = "weekly",
  group: TrendGroup = "jenis"
): MutuTrendResponse => ({
  unit: "All",
  view,
  group,
  periods: [],
  series: [],
});

export async function fetchMutuDashboard(
  unit: string = "all"
): Promise<MutuDashboardResponse> {
  const res = await http.get<APIResponse<MutuDashboardResponse>>(
    "/v1/dashboard/mutu",
    { unit }
  );
  return res.data ?? createEmptyDashboard();
}

export async function fetchMutuTrend(params?: {
  view?: TrendView;
  group?: TrendGroup;
  unit?: string;
}): Promise<MutuTrendResponse> {
  const res = await http.get<APIResponse<MutuTrendResponse>>(
    "/v1/dashboard/mutu/trend",
    params
  );
  return res.data ?? createEmptyTrend(params?.view, params?.group);
}
