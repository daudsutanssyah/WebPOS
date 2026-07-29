import api from "./axios";

export const getCustomers = (params?: {
    page?: number
    search?: string
    limit?: number
}) => api.get('/customers', {params})

export const getCustomersOptions = (params?: {
    search?: string
    limit?: number
}) => api.get('/customers/options', {params})

export const getCustomer = (id: number) => api.get(`/customers/${id}`)

export const createCustomer = (payload: {
    name: string
    phone: string
}) => api.post('/customers', payload)

export const updateCustomer = (
    id: number,
    payload: { name: string, phone: string }
) => api.put(`/customers/${id}`, payload)

export const deleteCustomer = (id: number) => api.delete(`/customers/${id}`)