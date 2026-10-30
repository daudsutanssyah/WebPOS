export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginatedResult<T> {
  items: T[] | any;
  pagination: PaginationMeta;
}

/**
 * Mensimulasikan latensi jaringan (network delay) agar UI spinner & loading state bekerja natural
 */
export const delay = (ms = 180): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper pembagi halaman (pagination) yang sesuai dengan struktur respons Laravel API Resource
 */
export function paginate<T>(items: T[], page = 1, limit = 10): PaginatedResult<T> {
  const safeLimit = Math.max(1, limit);
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / safeLimit));
  const current_page = Math.min(Math.max(1, page), last_page);
  const startIndex = (current_page - 1) * safeLimit;
  const endIndex = Math.min(startIndex + safeLimit, total);
  const pagedItems = items.slice(startIndex, endIndex);

  return {
    items: pagedItems,
    pagination: {
      current_page,
      last_page,
      per_page: safeLimit,
      total,
      from: total === 0 ? 0 : startIndex + 1,
      to: endIndex,
    },
  };
}

/**
 * Membungkus data ke struktur Axios response `{ data: { data: ... } }`
 */
export function apiDataResponse<T = any>(data: T) {
  return {
    data: {
      data,
    },
  };
}

/**
 * Membungkus pesan atau payload bebas ke struktur Axios response `{ data: ... }`
 */
export function apiRawResponse<T = any>(data: T) {
  return {
    data,
  };
}

/**
 * Membuat objek error yang menyerupai AxiosError untuk ditangkap oleh blok catch di komponen Vue
 */
export function createMockError(
  status: number,
  message: string,
  errors?: Record<string, string[]>
) {
  const error = new Error(message) as any;
  error.response = {
    status,
    data: {
      message,
      ...(errors ? { errors } : {}),
    },
  };
  return error;
}
