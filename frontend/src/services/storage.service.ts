import {
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
  type MockUser,
} from "@/data/mock-data";
import type { Customer } from "@/types/customer";
import type { ProductCategory } from "@/types/product-category";
import type { Product } from "@/types/product";
import type { Transaction } from "@/types/transaction";
import type { User } from "@/types/user";

export const STORAGE_KEYS = {
  USERS: "webpos_users",
  CATEGORIES: "webpos_categories",
  PRODUCTS: "webpos_products",
  CUSTOMERS: "webpos_customers",
  TRANSACTIONS: "webpos_transactions",
  CURRENT_USER: "webpos_current_user",
  TOKEN: "token",
} as const;

export class StorageService {
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[StorageService] Failed to parse item for key "${key}":`, err);
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[StorageService] Failed to set item for key "${key}":`, err);
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`[StorageService] Failed to remove item for key "${key}":`, err);
    }
  }

  /**
   * Menginisialisasi data dummy di LocalStorage jika belum pernah tersimpan
   */
  static initStorage(): void {
    if (localStorage.getItem(STORAGE_KEYS.USERS) === null) {
      this.setItem<MockUser[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    }

    if (localStorage.getItem(STORAGE_KEYS.CATEGORIES) === null) {
      this.setItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    }

    if (localStorage.getItem(STORAGE_KEYS.PRODUCTS) === null) {
      this.setItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }

    if (localStorage.getItem(STORAGE_KEYS.CUSTOMERS) === null) {
      this.setItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    }

    if (localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) === null) {
      this.setItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    }
  }

  /**
   * Reset seluruh database lokal kembali ke data dummy awal
   */
  static resetStorage(): void {
    this.setItem<MockUser[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.setItem<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    this.setItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    this.setItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    this.setItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }

  /**
   * Helper membaca File menjadi format Base64 data URL untuk preview/penyimpanan lokal
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
}

