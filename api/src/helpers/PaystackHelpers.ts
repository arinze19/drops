import axios, { AxiosError } from 'axios';
import config from '../config';
import { PaystackResponse } from '../types';

export default class PaystackHelpers {
  static async verifyAccountName(
    account_number: string,
    bank_code: string
  ): Promise<PaystackResponse> {
    try {
      const { data: account_name } = await axios.get(
        `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
        {
          headers: { Authorization: `Bearer ${config.paystack.secret}` },
        }
      );

      return account_name as PaystackResponse;
    } catch (error) {
      let message = 'Sorry, something went wrong';
      if (error instanceof AxiosError) {
        message = error.message;
      }

      throw new Error(message);
    }
  }
}
