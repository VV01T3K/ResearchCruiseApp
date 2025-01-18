export default {
  dev: import.meta.env.DEV,

  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  version: 2.0,
};
