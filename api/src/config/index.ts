import dotenv from 'dotenv';
dotenv.config();

const config = {
  paystack: {
    secret: process.env.PAYSTACK_SECRET_KEY!,
  },
  defaults: {
    user: process.env.DEFAULT_USER!,
  },
};

export default config;
