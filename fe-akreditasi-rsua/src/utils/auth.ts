const BASE64_URL_REGEX = /-/g;
const BASE64_URL_REGEX_SLASH = /_/g;

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const [, payload = ""] = token.split(".");
    if (!payload) return null;
    let normalized = payload
      .replace(BASE64_URL_REGEX, "+")
      .replace(BASE64_URL_REGEX_SLASH, "/");
    const paddingLength = (4 - (normalized.length % 4)) % 4;
    normalized = normalized.padEnd(normalized.length + paddingLength, "=");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const getCurrentDepartmentId = (): string | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const keys = ["department_id", "departmentId", "dept_id", "deptId"];
  for (const key of keys) {
    const value = payload[key];
    if (value == null) continue;
    if (typeof value === "number" || typeof value === "string") {
      return String(value);
    }
  }
  return null;
};
