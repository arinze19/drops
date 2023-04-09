import levenshtein from 'js-levenshtein';

export default class StringHelpers {
  static is_valid_levenshtein(
    user_account_name: string,
    paystack_account_name: string,
    tolerance = 2
  ) {
    return (
      levenshtein(
        this.lower_case(user_account_name),
        this.lower_case(paystack_account_name)
      ) <= tolerance
    );
  }

  static lower_case(string_one: string) {
    return string_one.toLocaleLowerCase();
  }
}
