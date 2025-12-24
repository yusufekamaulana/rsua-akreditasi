import { http, type APIResponse } from "./http";

export type IncidentStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PJ_REVIEWED"
  | "MUTU_REVIEWED"
  | "CLOSED";

export type IncidentCategory = "KTD" | "KTC" | "KNC" | "KPCS" | "SENTINEL";

export type IncidentRead = {
  id: number;
  reporter_id: number;
  patient_name: string | null;
  patient_identifier: string | null;
  reporter_type: string | null;
  age: number | null;
  age_group: string | null;
  gender: string | null;
  payer_type: string | null;
  admission_at: string | null;
  occurred_at: string;
  incident_place: string | null;
  skp_code: string | null;
  mdp_code: string | null;
  incident_subject: string | null;
  patient_context: string | null;
  responder_roles: string[] | null;
  immediate_action: string | null;
  has_similar_event: boolean | null;
  department_id: number | null;
  free_text_description: string;
  harm_indicator: string | null;
  status: IncidentStatus;
  predicted_category: IncidentCategory | null;
  predicted_confidence: number | null;
  model_version: string | null;
  grading: string | null;
  pj_decision: IncidentCategory | null;
  pj_notes: string | null;
  mutu_decision: IncidentCategory | null;
  mutu_notes: string | null;
  final_category: IncidentCategory | null;
  last_category_editor_id: number | null;
  created_at: string;
  updated_at: string;
};

export type IncidentCreate = {
  patient_name?: string | null;
  patient_identifier?: string | null;
  reporter_type?: string | null;
  age?: number | null;
  age_group?: string | null;
  gender?: string | null;
  payer_type?: string | null;
  admission_at?: string | null;
  occurred_at?: string | null;
  incident_place?: string | null;
  incident_subject?: string | null;
  patient_context?: string | null;
  responder_roles?: string[] | null;
  immediate_action?: string | null;
  has_similar_event?: boolean | null;
  department_id?: number | null;
  free_text_description: string;
  harm_indicator?: string | null;
};

type PaginatedIncidents = {
  items: IncidentRead[];
  page: number;
  per_page: number;
  total: number;
};

export async function listIncidents(params?: {
  page?: number;
  per_page?: number;
  status?: IncidentStatus;
  search?: string;
}): Promise<PaginatedIncidents> {
  const res = await http.get<APIResponse<PaginatedIncidents>>(
    "/v1/incidents",
    params
  );
  return (
    res.data ?? {
      items: [],
      page: 1,
      per_page: params?.per_page ?? 20,
      total: 0,
    }
  );
}

export async function createIncident(
  payload: IncidentCreate
): Promise<IncidentRead> {
  const res = await http.post<APIResponse<IncidentRead>>(
    "/v1/incidents",
    payload
  );
  if (!res.data) {
    throw new Error("Gagal membuat insiden");
  }
  return res.data;
}

export async function submitIncident(
  incidentId: number,
  confirmSubmit: boolean = true
): Promise<IncidentRead> {
  const res = await http.post<APIResponse<IncidentRead>>(
    `/v1/incidents/${incidentId}/submit`,
    { confirm_submit: confirmSubmit }
  );
  if (!res.data) {
    throw new Error("Gagal submit insiden");
  }
  return res.data;
}
