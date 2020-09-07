import axios from "axios";

// const url = 

const config = {
  url,
  crossdomain: true,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
};


function apiRequest(method, _config) {
  return axios({ ...config, method, ..._config }); 
}

export default {
  register: (data) => apiRequest("POST", { url: `${url}register`, data }), 
  login: (data) => apiRequest("POST", { url: `${url}login`, data }),
  logout: () => apiRequest("GET", { url: `${url}logout` }),
  currentUser: () => apiRequest("GET", { url: `${url}current` }),
  currentUserById: (id) => apiRequest("GET", { url: `${url}${id}` }),
};
