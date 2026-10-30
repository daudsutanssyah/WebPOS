import { delay, paginate, apiDataResponse, apiRawResponse } from "./mock-helpers";
import { MockDatabase } from "@/services/mock-db";

export const getCategories = async (params?: {
  page?: number;
  search?: string;
  limit?: number;
}) => {
  await delay(150);
  const all = MockDatabase.getCategories(params?.search);
  const paginated = paginate(all, params?.page || 1, params?.limit || 10);
  return apiDataResponse(paginated);
};

export const getCategory = async (id: number) => {
  await delay(80);
  const category = MockDatabase.getCategoryById(Number(id));
  return apiDataResponse(category);
};

export const createCategory = async (payload: {
  name: string;
  description?: string;
}) => {
  await delay(150);
  const created = MockDatabase.createCategory(payload);
  return apiDataResponse(created);
};

export const updateCategory = async (
  id: number,
  payload: { name: string; description?: string }
) => {
  await delay(150);
  const updated = MockDatabase.updateCategory(Number(id), payload);
  return apiDataResponse(updated);
};

export const uploadCategoryImage = async (id: number, formData: FormData) => {
  await delay(200);
  const updated = await MockDatabase.uploadCategoryImage(Number(id), formData);
  return apiDataResponse(updated);
};

export const deleteCategory = async (id: number) => {
  await delay(100);
  MockDatabase.deleteCategory(Number(id));
  return apiRawResponse({ message: "Category deleted successfully" });
};
