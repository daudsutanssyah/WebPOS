import type { Customer } from "@/types/customer";
import type { ProductCategory } from "@/types/product-category";
import type { Product } from "@/types/product";
import type { Transaction } from "@/types/transaction";
import type { User } from "@/types/user";

export interface MockUser extends User {
  passwords: string[];
}

export const INITIAL_USERS: MockUser[] = [
  {
    id: 1,
    name: "Demo Cashier",
    email: "demo@webpos.com",
    passwords: ["password", "demo12345"],
  },
];

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 1,
    name: "Coffee",
    description: "Espresso based, manual brew, and signature coffee drinks",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Non-Coffee",
    description: "Refreshing matcha, artisan tea, and milk based creations",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Pastry & Bakery",
    description: "Freshly baked artisan croissants, pastries, and desserts",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Main Course",
    description: "Hearty cafe meals, pastas, and signature savory dishes",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281226?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Snacks",
    description: "Crispy savory finger foods and sides for sharing",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    product_category_id: 1,
    name: "Espresso Single Origin",
    price: 22000,
    stock: 45,
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    product_category_id: 1,
    name: "Caramel Macchiato",
    price: 34000,
    stock: 35,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    product_category_id: 2,
    name: "Iced Matcha Latte",
    price: 32000,
    stock: 28,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    product_category_id: 3,
    name: "Butter Croissant",
    price: 26000,
    stock: 20,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    product_category_id: 4,
    name: "Spaghetti Aglio Olio",
    price: 42000,
    stock: 18,
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281226?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    product_category_id: 5,
    name: "Truffle Fries",
    price: 28000,
    stock: 30,
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    product_category_id: 2,
    name: "Fresh Lemon Iced Tea",
    price: 20000,
    stock: 50,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    product_category_id: 3,
    name: "Chocolate Lava Cake",
    price: 30000,
    stock: 15,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "Walk-in Customer",
    phone: "0800000000",
  },
  {
    id: 2,
    name: "Budi Santoso",
    phone: "081234567890",
  },
  {
    id: 3,
    name: "Siti Rahma",
    phone: "082345678901",
  },
];

// Transaksi awal dibuat kosong sesuai kebutuhan
export const INITIAL_TRANSACTIONS: Transaction[] = [];

