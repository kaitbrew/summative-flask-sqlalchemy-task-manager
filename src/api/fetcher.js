export const API = "http://localhost:5000";

export const fetcher = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
};