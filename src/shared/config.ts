export const getApiBase = () => {
  const { VITE_API_BASE: apiBase } = import.meta.env;
  if (!apiBase) throw new Error('VITE_API_BASE is not set, see .env.example');
  return apiBase;
};
