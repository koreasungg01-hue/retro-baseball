const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

export async function apiRequest(
  endpoint,
  { token, ...options } = {}
) {
  const headers = {
    ...(options.body
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...options.headers
  };

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || "요청에 실패했습니다."
    );

    error.status = response.status;
    error.code = data.error || "REQUEST_FAILED";

    throw error;
  }

  return data;
      }
