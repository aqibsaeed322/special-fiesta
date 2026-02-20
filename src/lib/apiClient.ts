import { setAuthState, type UserRole } from "./auth";
import { apiFetch } from "./api";

export type LoginResult = {
  role: UserRole;
  username: string;
};

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const MANAGER_USERNAME = "manager";
const MANAGER_PASSWORD = "manager123";

export async function login(username: string, password: string): Promise<LoginResult> {
  const u = username.trim();
  const p = password;

  if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
    setAuthState({ isAuthenticated: true, role: "admin", username: u });
    return { role: "admin", username: u };
  }

  if (u === MANAGER_USERNAME && p === MANAGER_PASSWORD) {
    setAuthState({ isAuthenticated: true, role: "manager", username: u });
    return { role: "manager", username: u };
  }

  throw new Error("Invalid credentials");
}

export async function listResource<T>(resource: string): Promise<T[]> {
  const res = await apiFetch<{ items?: T[] } | T[]>(`/api/${resource}`);
  if (Array.isArray(res)) return res;
  return res.items ?? [];
}

export async function createResource<T, Payload extends Record<string, unknown> | unknown>(
  resource: string,
  payload: Payload,
): Promise<T> {
  const res = await apiFetch<{ item?: T } | T>(`/api/${resource}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (typeof res === "object" && res !== null && "item" in res) {
    return (res as { item?: T }).item as T;
  }
  return res as T;
}

export async function updateResource<T, Payload extends Record<string, unknown> | unknown>(
  resource: string,
  id: string,
  payload: Payload,
): Promise<T> {
  const res = await apiFetch<{ item?: T } | T>(`/api/${resource}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (typeof res === "object" && res !== null && "item" in res) {
    return (res as { item?: T }).item as T;
  }
  return res as T;
}

export async function deleteResource(resource: string, id: string): Promise<void> {
  await apiFetch<void>(`/api/${resource}/${id}`, {
    method: "DELETE",
  });
}
