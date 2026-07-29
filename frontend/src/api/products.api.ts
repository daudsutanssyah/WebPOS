import api from "./axios";

export const getProducts = (params?: {
    page?: number
    search?: string
    limit?: number
    product_category_id?: number
}) => api.get('/products', {params})

export const getProductsOptions = (params?: {
    search?: string
    limit?: number
    product_category_id?: number
}) => api.get('/products/options', {params})

export const getProduct = (id: number) => api.get(`/products/${id}`)

export const createProduct = (payload: {
    product_category_id: number
    name: string
    price: number
    stock: number
}) => api.post('/products', payload)

export const updateProduct = (
    id: number,
    payload: {
        product_category_id: number
        name: string
        price: number
        stock: number
    }
) => api.put(`/products/${id}`, payload)

export const uploadProductImage = (id: number, formData: FormData) =>
    api.post(`/products/${id}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

export const deleteProduct = (id: number) => api.delete(`/products/${id}`)