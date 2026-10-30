import { delay, paginate, apiDataResponse } from "./mock-helpers";
import { MockDatabase } from "@/services/mock-db";

export const getTransactions = async (params?: {
  page?: number;
  search?: string;
  limit?: number;
}) => {
  await delay(150);
  const all = MockDatabase.getTransactions(params?.search);
  const paginated = paginate(all, params?.page || 1, params?.limit || 10);
  return apiDataResponse(paginated);
};

export const getTransaction = async (id: number) => {
  await delay(80);
  const transaction = MockDatabase.getTransactionById(Number(id));
  return apiDataResponse(transaction);
};

export const createTransaction = async (payload: {
  customer_id: number;
  items: { product_id: number; quantity: number }[];
}) => {
  await delay(200);
  const transaction = MockDatabase.createTransaction(payload);
  return apiDataResponse(transaction);
};
