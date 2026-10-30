import { delay, paginate, apiDataResponse, apiRawResponse } from "./mock-helpers";
import { MockDatabase } from "@/services/mock-db";

export const getProducts = async (params?: {
  page?: number;
  search?: string;
  limit?: number;
  product_category_id?: number;
}) => {
  await delay(150);
  const all = MockDatabase.getProducts({
    search: params?.search,
    product_category_id: params?.product_category_id,
  });
  const paginated = paginate(all, params?.page || 1, params?.limit || 10);
  return apiDataResponse(paginated);
};

export const getProductsOptions = async (params?: {
  search?: string;
  limit?: number;
  product_category_id?: number;
}) => {
  await delay(100);
  let all = MockDatabase.getProducts({
    search: params?.search,
    product_category_id: params?.product_category_id,
  });
  if (params?.limit) {
    all = all.slice(0, params.limit);
  }
  return apiDataResponse(all);
};

export const getProduct = async (id: number) => {
  await delay(80);
  const product = MockDatabase.getProductById(Number(id));
  return apiDataResponse(product);
};

export const createProduct = async (payload: {
  product_category_id: number;
  name: string;
  price: number;
  stock: number;
}) => {
  await delay(150);
  const created = MockDatabase.createProduct(payload);
  return apiDataResponse(created);
};

export const updateProduct = async (
  id: number,
  payload: {
    product_category_id: number;
    name: string;
    price: number;
    stock: number;
  }
) => {
  await delay(150);
  const updated = MockDatabase.updateProduct(Number(id), payload);
  return apiDataResponse(updated);
};

export const uploadProductImage = async (id: number, formData: FormData) => {
  await delay(200);
  const updated = await MockDatabase.uploadProductImage(Number(id), formData);
  return apiDataResponse(updated);
};

export const deleteProduct = async (id: number) => {
  await delay(100);
  MockDatabase.deleteProduct(Number(id));
  return apiRawResponse({ message: "Product deleted successfully" });
};
