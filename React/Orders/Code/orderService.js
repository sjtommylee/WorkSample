import axios from "axios";
import * as serviceHelper from "./serviceHelpers";
const url = `${serviceHelper.API_NODE_HOST_PREFIX}/api/orders`;

const insertOrder = (payload) => {
  const config = {
    method: "POST",
    url: `${url}`,
    withCredentials: true,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const insertOrderTransaction = (payload) => {
  const config = {
    method: "POST",
    url: `${url}/transactions`,
    withCredentials: true,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${url}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getAllByCreatedBy = (userId, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${url}/users/${userId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getDetailsById = (id) => {
  const config = {
    method: "GET",
    url: `${url}/details/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getByMessengerId = (pageIndex, pageSize, messengerId) => {
  const config = {
    method: "GET",
    url: `${url}/messenger/${messengerId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getById = (id) => {
  const config = {
    method: "GET",
    url: `${url}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getByTrackingCode = (trackingId) => {
  const config = {
    method: "GET",
    url: `${url}/trackingid/${trackingId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getByUserId = (userId) => {
  const config = {
    method: "GET",
    url: `${url}/users/${userId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const update = (id, payload) => {

  const config = {
    method: "PUT",
    url: `${url}/${id}`,
    withCredentials: true,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const updateStatus = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${url}/status/${id}`,
    withCredentials: true,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(() => id)
    .catch(serviceHelper.onGlobalError);
};

const history = (pageIndex, pageSize, messengerId) => {
  const config = {
    method: "GET",
    url: `${url}/history/messenger/${messengerId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const messengerForFees = (pageIndex, pageSize, messengerId, time) => {
  const config = {
    method: "GET",
    url: `${url}/fees/messenger/${messengerId}?pageIndex=${pageIndex}&pageSize=${pageSize}&time=${time}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const openOrders = () => {
  const config = {
    method: "GET",
    url: `${serviceHelper.API_HOST_PREFIX}/api/orders/open`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const searchByStatusId = (pageIndex, pageSize, query) => {
  const config = {
    method: "GET",
    url: `${url}/search/?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getAllByInTransit = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${url}/in-transit/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
}

export {
  insertOrder,
  insertOrderTransaction,
  getAll,
  getAllByCreatedBy,
  getDetailsById,
  getByMessengerId,
  getById,
  getByTrackingCode,
  getByUserId,
  update,
  updateStatus,
  history,
  messengerForFees,
  openOrders,
  searchByStatusId,
  getAllByInTransit
};
