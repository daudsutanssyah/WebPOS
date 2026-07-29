import { createTransaction } from "@/api/transaction.api";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/transaction";
import { defineStore } from "pinia";

export const usePosStore = defineStore('pos', {
    state: () => ({
        cart: [] as CartItem[],
        customerId: null as number | null,
        loading: false
    }),

    getters: {
        subtotal: (state) => {
            return state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        },
        tax: (state) => {
            const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
            return Math.round(subtotal * 0.11) // 11% tax
        },
        total(): number {
            return this.subtotal + this.tax
        },
        itemCount: (state) => {
            return state.cart.reduce((sum, item) => sum + item.quantity, 0)
        }
    },

    actions: {
        addToCart(product: Product){
            const existing = this.cart.find(item => item.product.id === product.id)

            if(existing){
                existing.quantity++
            } else{
                this.cart.push({ product, quantity: 1})
            }
        },

        removeFromCart(productId: number){
          const index = this.cart.findIndex(item => item.product.id === productId)

          if(index > -1){
            this.cart.splice(index, 1)
          }
        },

        updateQuantity(productId: number, quantity: number){
            const item = this.cart.find(item => item.product.id === productId)

            if(item){
               if(quantity <= 0){
                    this.removeFromCart(productId)
               } else {
                item.quantity = quantity
               }
            }
        },

        clearCart(){
            this.cart = []
            this.customerId = null
        },

        setCustomer(id: number | null) {
            this.customerId = id
        },

        async checkout() {
            if(!this.customerId){
                throw new Error('Customer is required')
            }

            this.loading = true

            try {
                const payload = {
                    customer_id: this.customerId,
                    items: this.cart.map(item => ({
                        product_id: item.product.id,
                        quantity: item.quantity
                    }))
                }

                const res = await createTransaction(payload)

                this.clearCart()
                return res.data.data
            }  finally {
                this.loading = false
            }
        }
    }
})