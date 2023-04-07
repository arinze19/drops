export interface User {
  id: number;
  name: string;
  bank_name: string | null;
  account_number: string | null;
  is_verified: boolean;
}

export interface Bank {
  name: string;
  slug: string;
  code: string;
  ussd: string;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}
