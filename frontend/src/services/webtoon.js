import { apiRequest } from "./api";

export function fetchWebtoons(params = {}) {
  const query = new URLSearchParams();

  if (params.q) query.set("q", params.q);
  if (params.genre) query.set("genre", params.genre);

  const suffix = query.size ? `?${query}` : "";

  return apiRequest(`/webtoons${suffix}`);
}

export function fetchWebtoon(id) {
  return apiRequest(
    `/webtoons/${encodeURIComponent(id)}`
  );
}
