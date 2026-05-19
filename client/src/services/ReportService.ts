import AxiosInstance from "./AxiosInstance";

const ReportService = {
  dashboard: async () => AxiosInstance.get("/reports/dashboard"),
  salesSummary: async (from: string, to: string) =>
    AxiosInstance.get(`/reports/salesSummary?from=${from}&to=${to}`),
  topProducts: async (from: string, to: string, limit = 10) =>
    AxiosInstance.get(`/reports/topProducts?from=${from}&to=${to}&limit=${limit}`),
  inventory: async () => AxiosInstance.get("/reports/inventory"),
};

export default ReportService;
