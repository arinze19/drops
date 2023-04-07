import levenshtein from 'js-levenshtein';

export default class StringHelpers {
  static is_valid_levenshtein(
    user_account_name: string,
    paystack_account_name: string,
    tolerance = 2
  ) {
    return levenshtein(user_account_name, paystack_account_name) <= tolerance;
  }
}
