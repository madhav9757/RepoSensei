const API_BASE = import.meta.env.VITE_BACKEND_URL;

// Create a single api object with get and post methods
const api = {
  get: async (path) => {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: "include", // needed for cookies (GitHub OAuth)
    });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  },

  post: async (path, body = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  },
};

export default api;
