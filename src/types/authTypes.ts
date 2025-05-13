export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
  }