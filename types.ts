export interface Lead {
  name: string;
  email: string;
  ip_address?: string; // Opcional
  country?: string;    // Opcional
  region?: string;     // Opcional
  city?: string;       // Opcional
}