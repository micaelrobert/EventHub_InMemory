export interface ApiResponse<T> {
  sucesso: boolean
  mensagem: string
  dados?: T
  erros: string[]
}

export interface PaginatedResponse<T> {
  items: T[]
  totalItems: number
  currentPage: number
  totalPages: number
  pageSize: number
}
export {}