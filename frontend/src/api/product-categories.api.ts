import api from "./axios";

export const getCategories = (params?: {
    page?: number
    search?: string
    limit?: number
}) => api.get('/product-categories', {params})

export const getCategory = (id: number) => api.get(`/product-categories/${id}`)

export const createCategory = (payload: {
    name: string
    description?: string
}) => api.post('/product-categories', payload)

export const updateCategory = (
    id: number,
    payload: {name: string, description?: string}
) => api.put(`/product-categories/${id}`, payload)

export const uploadCategoryImage = (id: number, formData: FormData) =>
    api.post(`/product-categories/${id}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

export const deleteCategory = (id: number) => api.delete(`/product-categories/${id}`)