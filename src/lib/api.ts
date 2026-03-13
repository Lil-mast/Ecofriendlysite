/**
 * API client for EcoNexus backend.
 * Uses VITE_API_URL in production, or Vite proxy /api in development.
 */
const BASE = import.meta.env.VITE_API_URL || '';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const base = BASE || '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http') ? path : base ? `${base.replace(/\/$/, '')}${normalizedPath}` : `/api/v1${normalizedPath}`;
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const auth = {
  login: (email: string, password: string) =>
    api<{ token: string; user: { id: string; email: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, name?: string) =>
    api<{ token: string; user: { id: string; email: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name: name || email }),
    }),
  getProfile: () => api<{ email: string; name: string }>('/user/profile'),
};

export const carbon = {
  getDashboard: () => api<{ totalCo2e: number }>('/carbon/dashboard'),
  getEntries: () => api<unknown[]>('/carbon/entries'),
};

export const marketplace = {
  listCredits: () => api<unknown[]>('/marketplace/credits'),
  getCredit: (id: string) => api<unknown>(`/marketplace/credits/${id}`),
};
