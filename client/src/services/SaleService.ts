import AxiosInstance from "./AxiosInstance";

const SaleService = {
  loadSales: async (page: number, search = "", from = "", to = "") => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return AxiosInstance.get(`/sale/loadSales?${params}`);
  },
  storeSale: async (data: { notes?: string; items: { product_id: number; quantity: number }[] }) =>
    AxiosInstance.post("/sale/storeSale", data),
};

export default SaleService;
