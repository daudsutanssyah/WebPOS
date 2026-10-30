import {
  StorageService,
  STORAGE_KEYS,
} from "./storage.service";
import type { Customer } from "@/types/customer";
import type { ProductCategory } from "@/types/product-category";
import type { Product } from "@/types/product";
import type { Transaction, TransactionItem } from "@/types/transaction";
import type { User } from "@/types/user";
import type { MockUser } from "@/data/mock-data";
import { createMockError } from "@/api/mock-helpers";

export class MockDatabase {
  // ==========================================
  // AUTHENTICATION
  // ==========================================

  static async login(email: string, password: string): Promise<{ token: string; user: User }> {
    StorageService.initStorage();
    const users = StorageService.getItem<MockUser[]>(STORAGE_KEYS.USERS, []);

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        (u.passwords.includes(password) || password === "password" || password === "demo12345")
    );

    if (!user) {
      throw createMockError(401, "Email atau password yang Anda masukkan salah.");
    }

    const token = `mock-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const userData: User = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    StorageService.setItem<User>(STORAGE_KEYS.CURRENT_USER, userData);

    return { token, user: userData };
  }

  static async me(): Promise<User> {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      throw createMockError(401, "Unauthenticated");
    }

    const user = StorageService.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) {
      // Fallback demo user
      const users = StorageService.getItem<MockUser[]>(STORAGE_KEYS.USERS, []);
      const firstUser = users[0];
      if (firstUser) {
        const fallback: User = { id: firstUser.id, name: firstUser.name, email: firstUser.email };
        StorageService.setItem(STORAGE_KEYS.CURRENT_USER, fallback);
        return fallback;
      }
      throw createMockError(401, "Unauthenticated");
    }

    return user;
  }

  static async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    StorageService.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // ==========================================
  // CATEGORIES
  // ==========================================

  static getCategories(search?: string): ProductCategory[] {
    StorageService.initStorage();
    let categories = StorageService.getItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, []);

    if (search && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      categories = categories.filter((c) => c.name.toLowerCase().includes(q));
    }

    return categories;
  }

  static getCategoryById(id: number): ProductCategory {
    StorageService.initStorage();
    const categories = StorageService.getItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, []);
    const found = categories.find((c) => c.id === id);

    if (!found) {
      throw createMockError(404, `Category with id ${id} not found`);
    }

    return found;
  }

  static createCategory(payload: { name: string; description?: string }): ProductCategory {
    StorageService.initStorage();
    const categories = StorageService.getItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, []);

    if (!payload.name || !payload.name.trim()) {
      throw createMockError(422, "Validation error", {
        name: ["The name field is required."],
      });
    }

    const nextId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
    const newCategory: ProductCategory = {
      id: nextId,
      name: payload.name.trim(),
      description: payload.description || null,
      image: null,
    };

    categories.unshift(newCategory);
    StorageService.setItem(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  }

  static updateCategory(
    id: number,
    payload: { name: string; description?: string }
  ): ProductCategory {
    StorageService.initStorage();
    const categories = StorageService.getItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, []);
    const category = categories.find((c) => c.id === id);

    if (!category) {
      throw createMockError(404, `Category with id ${id} not found`);
    }

    if (!payload.name || !payload.name.trim()) {
      throw createMockError(422, "Validation error", {
        name: ["The name field is required."],
      });
    }

    category.name = payload.name.trim();
    category.description = payload.description || null;

    StorageService.setItem(STORAGE_KEYS.CATEGORIES, categories);

    // Update nested category name in products
    this.syncProductCategories();

    return category;
  }

  static async uploadCategoryImage(id: number, formData: FormData): Promise<ProductCategory> {
    StorageService.initStorage();
    const categories = StorageService.getItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, []);
    const category = categories.find((c) => c.id === id);

    if (!category) {
      throw createMockError(404, `Category with id ${id} not found`);
    }

    const imageFile = formData.get("image");
    if (imageFile instanceof File) {
      const dataUrl = await StorageService.fileToBase64(imageFile);
      category.image = dataUrl;
    }

    StorageService.setItem(STORAGE_KEYS.CATEGORIES, categories);
    this.syncProductCategories();

    return category;
  }

  static deleteCategory(id: number): void {
    StorageService.initStorage();
    let categories = StorageService.getItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, []);
    categories = categories.filter((c) => c.id !== id);
    StorageService.setItem(STORAGE_KEYS.CATEGORIES, categories);
  }

  // ==========================================
  // PRODUCTS
  // ==========================================

  static getProducts(params?: {
    search?: string;
    product_category_id?: number;
  }): Product[] {
    StorageService.initStorage();
    let products = StorageService.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const categories = StorageService.getItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, []);
    const categoryMap = new Map<number, ProductCategory>(categories.map((c) => [c.id, c]));

    // Attach category object relation
    products = products.map((p) => ({
      ...p,
      category: categoryMap.get(p.product_category_id) || undefined,
    }));

    if (params?.product_category_id) {
      products = products.filter((p) => p.product_category_id === Number(params.product_category_id));
    }

    if (params?.search && params.search.trim() !== "") {
      const q = params.search.toLowerCase().trim();
      products = products.filter((p) => p.name.toLowerCase().includes(q));
    }

    return products;
  }

  static getProductById(id: number): Product {
    StorageService.initStorage();
    const products = this.getProducts();
    const found = products.find((p) => p.id === id);

    if (!found) {
      throw createMockError(404, `Product with id ${id} not found`);
    }

    return found;
  }

  static createProduct(payload: {
    product_category_id: number;
    name: string;
    price: number;
    stock: number;
  }): Product {
    StorageService.initStorage();
    const products = StorageService.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);

    const errors: Record<string, string[]> = {};
    if (!payload.name || !payload.name.trim()) errors.name = ["The name field is required."];
    if (!payload.product_category_id) errors.product_category_id = ["The category is required."];
    if (payload.price === undefined || payload.price <= 0) errors.price = ["The price must be greater than 0."];
    if (payload.stock === undefined || payload.stock < 0) errors.stock = ["The stock cannot be negative."];

    if (Object.keys(errors).length > 0) {
      throw createMockError(422, "Validation error", errors);
    }

    const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const category = this.getCategoryById(Number(payload.product_category_id));

    const newProduct: Product = {
      id: nextId,
      product_category_id: Number(payload.product_category_id),
      name: payload.name.trim(),
      price: Number(payload.price),
      stock: Number(payload.stock),
      image: null,
      category,
    };

    products.unshift(newProduct);
    StorageService.setItem(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  }

  static updateProduct(
    id: number,
    payload: {
      product_category_id: number;
      name: string;
      price: number;
      stock: number;
    }
  ): Product {
    StorageService.initStorage();
    const products = StorageService.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const product = products.find((p) => p.id === id);

    if (!product) {
      throw createMockError(404, `Product with id ${id} not found`);
    }

    const errors: Record<string, string[]> = {};
    if (!payload.name || !payload.name.trim()) errors.name = ["The name field is required."];
    if (!payload.product_category_id) errors.product_category_id = ["The category is required."];
    if (payload.price === undefined || payload.price <= 0) errors.price = ["The price must be greater than 0."];
    if (payload.stock === undefined || payload.stock < 0) errors.stock = ["The stock cannot be negative."];

    if (Object.keys(errors).length > 0) {
      throw createMockError(422, "Validation error", errors);
    }

    const category = this.getCategoryById(Number(payload.product_category_id));

    product.product_category_id = Number(payload.product_category_id);
    product.name = payload.name.trim();
    product.price = Number(payload.price);
    product.stock = Number(payload.stock);
    product.category = category;

    StorageService.setItem(STORAGE_KEYS.PRODUCTS, products);
    return product;
  }

  static async uploadProductImage(id: number, formData: FormData): Promise<Product> {
    StorageService.initStorage();
    const products = StorageService.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const product = products.find((p) => p.id === id);

    if (!product) {
      throw createMockError(404, `Product with id ${id} not found`);
    }

    const imageFile = formData.get("image");
    if (imageFile instanceof File) {
      const dataUrl = await StorageService.fileToBase64(imageFile);
      product.image = dataUrl;
    }

    StorageService.setItem(STORAGE_KEYS.PRODUCTS, products);
    return product;
  }

  static deleteProduct(id: number): void {
    StorageService.initStorage();
    let products = StorageService.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    products = products.filter((p) => p.id !== id);
    StorageService.setItem(STORAGE_KEYS.PRODUCTS, products);
  }

  private static syncProductCategories(): void {
    const categories = StorageService.getItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, []);
    const categoryMap = new Map<number, ProductCategory>(categories.map((c) => [c.id, c]));
    const products = StorageService.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);

    const updated = products.map((p) => ({
      ...p,
      category: categoryMap.get(p.product_category_id) || undefined,
    }));
    StorageService.setItem(STORAGE_KEYS.PRODUCTS, updated);
  }

  // ==========================================
  // CUSTOMERS
  // ==========================================

  static getCustomers(search?: string): Customer[] {
    StorageService.initStorage();
    let customers = StorageService.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);

    if (search && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      customers = customers.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }

    return customers;
  }

  static getCustomerById(id: number): Customer {
    StorageService.initStorage();
    const customers = StorageService.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const found = customers.find((c) => c.id === id);

    if (!found) {
      throw createMockError(404, `Customer with id ${id} not found`);
    }

    return found;
  }

  static createCustomer(payload: { name: string; phone: string }): Customer {
    StorageService.initStorage();
    const customers = StorageService.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);

    if (!payload.name || !payload.name.trim()) {
      throw createMockError(422, "Validation error", {
        name: ["The name field is required."],
      });
    }

    const nextId = customers.length > 0 ? Math.max(...customers.map((c) => c.id)) + 1 : 1;
    const newCustomer: Customer = {
      id: nextId,
      name: payload.name.trim(),
      phone: payload.phone?.trim() || "",
    };

    customers.unshift(newCustomer);
    StorageService.setItem(STORAGE_KEYS.CUSTOMERS, customers);
    return newCustomer;
  }

  static updateCustomer(id: number, payload: { name: string; phone: string }): Customer {
    StorageService.initStorage();
    const customers = StorageService.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const customer = customers.find((c) => c.id === id);

    if (!customer) {
      throw createMockError(404, `Customer with id ${id} not found`);
    }

    if (!payload.name || !payload.name.trim()) {
      throw createMockError(422, "Validation error", {
        name: ["The name field is required."],
      });
    }

    customer.name = payload.name.trim();
    customer.phone = payload.phone?.trim() || "";

    StorageService.setItem(STORAGE_KEYS.CUSTOMERS, customers);
    return customer;
  }

  static deleteCustomer(id: number): void {
    StorageService.initStorage();
    let customers = StorageService.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    customers = customers.filter((c) => c.id !== id);
    StorageService.setItem(STORAGE_KEYS.CUSTOMERS, customers);
  }

  // ==========================================
  // TRANSACTIONS
  // ==========================================

  static getTransactions(search?: string): Transaction[] {
    StorageService.initStorage();
    let transactions = StorageService.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);

    if (search && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      transactions = transactions.filter(
        (t) =>
          t.code.toLowerCase().includes(q) ||
          (t.customer?.name && t.customer.name.toLowerCase().includes(q))
      );
    }

    return transactions;
  }

  static getTransactionById(id: number): Transaction {
    StorageService.initStorage();
    const transactions = StorageService.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const found = transactions.find((t) => t.id === id);

    if (!found) {
      throw createMockError(404, `Transaction with id ${id} not found`);
    }

    return found;
  }

  static createTransaction(payload: {
    customer_id: number;
    items: { product_id: number; quantity: number }[];
  }): any {
    StorageService.initStorage();
    const transactions = StorageService.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const products = StorageService.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const customer = this.getCustomerById(payload.customer_id);

    if (!payload.items || payload.items.length === 0) {
      throw createMockError(422, "Transaction must have at least one item.");
    }

    const nextId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const code = `TRX-${dateStr}-${String(nextId).padStart(4, "0")}`;

    const transactionItems: any[] = [];
    let subtotal = 0;

    for (let i = 0; i < payload.items.length; i++) {
      const item = payload.items[i];
      if (!item) continue;
      const prodIndex = products.findIndex((p) => p.id === item.product_id);

      if (prodIndex === -1) {
        throw createMockError(404, `Product id ${item.product_id} not found`);
      }

      const product = products[prodIndex];
      if (!product) continue;
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      // Kurangi stok produk secara real-time di database lokal
      product.stock = Math.max(0, product.stock - item.quantity);

      transactionItems.push({
        id: i + 1,
        transaction_id: nextId,
        product_id: product.id,
        product_name: product.name,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemSubtotal,
      });
    }

    const tax = Math.round(subtotal * 0.11); // PPN 11%
    const total = subtotal + tax;

    const newTransaction: Transaction = {
      id: nextId,
      code,
      customer_id: customer.id,
      customer,
      subtotal,
      tax,
      total,
      created_at: now.toISOString(),
      items: transactionItems,
    };

    // Simpan pengurangan stok produk
    StorageService.setItem(STORAGE_KEYS.PRODUCTS, products);

    // Simpan transaksi baru di posisi paling atas (terbaru)
    transactions.unshift(newTransaction);
    StorageService.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);

    return newTransaction;
  }
}
