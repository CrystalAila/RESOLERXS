import AxiosInstance from "./AxiosInstance";

const ProductService = {
  loadProducts: async (page: number, search: string, lowStock = false) => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (lowStock) params.set("low_stock", "1");
    return AxiosInstance.get(`/product/loadProducts?${params}`);
  },
  loadAllProducts: async () => AxiosInstance.get("/product/loadAllProducts"),
  getProductImage: async (productId: number) =>
    AxiosInstance.get(`/product/getProductImage/${productId}`, {
      responseType: "blob",
    }),
  storeProduct: async (data: FormData) =>
    AxiosInstance.post("/product/storeProduct", data),
  updateProduct: async (productId: number, data: FormData) =>
    AxiosInstance.post(`/product/updateProduct/${productId}`, data),
  destroyProduct: async (productId: number) =>
    AxiosInstance.put(`/product/destroyProduct/${productId}`),
};

export default ProductService;
