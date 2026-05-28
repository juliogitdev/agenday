

import axios from "axios";
export const agenday_api = axios.create({ baseURL:import.meta.env.VITE_API_URL});
export const agenday_img = axios.create({ baseURL:import.meta.env.VITE_STORAGE_BASE_URL});