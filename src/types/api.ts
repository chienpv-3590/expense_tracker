// API Response types
export type ApiResponse<T = unknown> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  code?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// API Error types
export type ApiError = {
  message: string;
  code?: string;
  field?: string;
};

export type ValidationError = {
  field: string;
  message: string;
};
