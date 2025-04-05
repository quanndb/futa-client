import axios from "@/services";

const authAPI = {
  login: (params) => {
    const url = "/auth/login";
    return axios.post(url, params);
  },
  register: (params) => {
    const url = "/accounts/register";
    return axios.post(url, params);
  },
  logout: () => {
    const url = "/auth/logout";
    return axios.post(url);
  },
  loginWithGoogle: (params) => {
    const url = "auth/provider/google?code=" + params;
    return axios.post(url);
  },
};

export default authAPI;
