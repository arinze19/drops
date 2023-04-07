import db from '../db';
import { PaystackHelpers, StringHelpers } from '../helpers';
import { User } from '../types';

export default class AccountMutations {
  static async createAccount(
    parent: unknown,
    args: Omit<User, 'id' | 'is_verified'>
  ) {
    const bank_code = db.retrieveBankCode(args.bank_name!);

    if (!bank_code) {
      throw new Error('We do not support this bank, please try another');
    }

    const { data } = await PaystackHelpers.verifyAccountName(
      args.account_number!,
      bank_code
    );

    if (!StringHelpers.is_valid_levenshtein(args.name, data.account_name)) {
      throw new Error(
        'Please check the spelling of your account name and try again'
      );
    }

    const user = db.modifyUser(args.name, { ...args, is_verified: true });

    if (!user) {
      throw new Error(
        'This user does not exist in our systems, please seed the database and try again'
      );
    }

    return user;
  }

  static async retrieveAccount(
    parent: unknown,
    args: Pick<User, 'account_number'> & { bank_code: string }
  ) {
    const { data } = await PaystackHelpers.verifyAccountName(
      args.account_number!,
      args.bank_code
    );

    let user = db.retrieveFuzzyUser(data.account_name); // use paystack account name to waddle through database and get a matching levenshtein name

    if (!user) {
      user = db.createUser({
        name: data.account_name,
        account_number: args.account_number,
        bank_name: db.retrieveBankName(args.bank_code),
      });
    }

    return db.modifyUser(user.name, {
      account_number: args.account_number,
      bank_name: db.retrieveBankName(args.bank_code),
      is_verified: true,
    })!;
  }
}
