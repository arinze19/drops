export default {
  user: function () {
    return {
      name: 'JOHN DOE',
      bank_name: 'United Bank For Africa',
      account_number: '1234567890',
    };
  },
  paystack_success: function () {
    return {
      status: true,
      message: 'verified',
      data: {
        account_number: this.user().account_number,
        account_name: this.user().name,
        bank_id: 20,
      },
    };
  },
};
