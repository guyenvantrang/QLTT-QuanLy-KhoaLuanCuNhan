// models/allocation-types.ts

export interface StudentPayload {
  masv: string;
  diachi: string;
  lat :number;
  long:number;
}

export interface CompanyPayload {
  macongty: string;
  diachi: string; // Nếu muốn, có thể để optional diachi?: string;
  soluong: number;
  lat : number;
  long : number;
}
