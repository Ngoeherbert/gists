import { get, post } from "./api";

export async function startCall(data) {
  return post("/calls", data);
}

export async function getCall(id) {
  return get(`/calls/${id}`);
}

export async function acceptCall(id) {
  return post(`/calls/${id}/accept`);
}

export async function declineCall(id) {
  return post(`/calls/${id}/decline`);
}

export async function endCall(id) {
  return post(`/calls/${id}/end`);
}

export async function cancelCall(id) {
  return post(`/calls/${id}/cancel`);
}

export async function getCallHistory(params = {}) {
  return get("/calls/history", { params });
}

export async function getCallToken(id) {
  return get(`/calls/${id}/token`);
}

export default {
  startCall,
  getCall,
  acceptCall,
  declineCall,
  endCall,
  cancelCall,
  getCallHistory,
  getCallToken,
};
