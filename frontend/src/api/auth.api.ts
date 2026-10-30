import { delay, apiDataResponse, apiRawResponse } from "./mock-helpers";
import { MockDatabase } from "@/services/mock-db";

export const loginApi = async (payload: { email: string; password: string }) => {
  await delay(200);
  const result = await MockDatabase.login(payload.email, payload.password);
  return apiDataResponse(result);
};

export const meApi = async () => {
  await delay(80);
  const user = await MockDatabase.me();
  return apiDataResponse(user);
};

export const logoutApi = async () => {
  await delay(80);
  await MockDatabase.logout();
  return apiRawResponse({ message: "Successfully logged out" });
};
