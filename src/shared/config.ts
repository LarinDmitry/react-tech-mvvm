export const getApiBase = () => {
  const apiBase = import.meta.env.VITE_API_BASE;
  if (!apiBase) throw new Error('VITE_API_BASE is not set, see .env.example');
  return apiBase;
};
