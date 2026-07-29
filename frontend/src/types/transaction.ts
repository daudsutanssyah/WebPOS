import type { Customer } from "./customer"
import type { Product } from "./product"

export interface TransactionItem {
    id: number
    transaction_id: number
    product_id: number
    product_name: string
    quantity: number
    price: number
    subtotal: number
}

export interface Transaction {
    id: number
    code: string
    customer_id: number | null
    subtotal: number
    tax: number
    total: number
    created_at: string
    customer?: Customer | null
    items?: TransactionItem[]
}

export interface CartItem {
    product: Product
    quantity: number
}