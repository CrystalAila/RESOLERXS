import AxiosInstance from "./AxiosInstance";

const UserService = {
  loadUsers: async (page: number, search: string) => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    return AxiosInstance.get(`/user/loadUsers?${params}`);
  },
  storeUser: async (data: object) => AxiosInstance.post("/user/storeUser", data),
  updateUser: async (userId: number, data: object) =>
    AxiosInstance.put(`/user/updateUser/${userId}`, data),
  destroyUser: async (userId: number) =>
    AxiosInstance.put(`/user/destroyUser/${userId}`),
};

export default UserService;
