import { delay, paginate, apiDataResponse, apiRawResponse } from "./mock-helpers";
import { MockDatabase } from "@/services/mock-db";

export const getCustomers = async (params?: {
  page?: number;
  search?: string;
  limit?: number;
}) => {
  await delay(150);
  const all = MockDatabase.getCustomers(params?.search);
  const paginated = paginate(all, params?.page || 1, params?.limit || 10);
  return apiDataResponse(paginated);
};

export const getCustomersOptions = async (params?: {
  search?: string;
  limit?: number;
}) => {
  await delay(100);
  let all = MockDatabase.getCustomers(params?.search);
  if (params?.limit) {
    all = all.slice(0, params.limit);
  }
  return apiDataResponse(all);
};

export const getCustomer = async (id: number) => {
  await delay(80);
  const customer = MockDatabase.getCustomerById(Number(id));
  return apiDataResponse(customer);
};

export const createCustomer = async (payload: { name: string; phone: string }) => {
  await delay(150);
  const created = MockDatabase.createCustomer(payload);
  return apiDataResponse(created);
};

export const updateCustomer = async (
  id: number,
  payload: { name: string; phone: string }
) => {
  await delay(150);
  const updated = MockDatabase.updateCustomer(Number(id), payload);
  return apiDataResponse(updated);
};

export const deleteCustomer = async (id: number) => {
  await delay(100);
  MockDatabase.deleteCustomer(Number(id));
  return apiRawResponse({ message: "Customer deleted successfully" });
};
