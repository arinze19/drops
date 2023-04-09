import stubs from '../jest/stubs';
import { AccountMutations } from '../../mutations';
import { StringHelpers, PaystackHelpers } from '../../helpers';
import DatabaseService from '../../db/DatabaseService';

jest.mock('../../db/DatabaseService.ts', () => {
  return {
    createUser: jest.fn().mockReturnValue({
      id: Math.floor(1500 * Math.random()),
      ...stubs.user(),
      is_verified: false,
    }),
    retrieveUser: jest.fn().mockReturnValue({}),
    retrieveUsers: jest.fn().mockReturnValue({}),
    retrieveFuzzyUser: jest.fn().mockReturnValue({}),
    modifyUser: jest.fn().mockReturnValue({
      ...stubs.user(),
      is_verified: true,
    }),
  };
});

describe('Account Mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(PaystackHelpers, 'verifyAccountName')
      .mockResolvedValue(stubs.paystack_success());
    jest.spyOn(StringHelpers, 'is_valid_levenshtein');
  });

  describe('Mutation One', () => {
    describe('when mutation account_name matches DEFAULT_USER', () => {
      const user = stubs.user();
      const paystack = stubs.paystack_success();

      it('is defined', () => {
        expect(AccountMutations.createAccount).toBeDefined();
      });
      it('verifies user through is_verified prop', async () => {
        const verified_user = await AccountMutations.createAccount(user);
        expect(StringHelpers.is_valid_levenshtein).toHaveBeenCalledWith(
          user.name,
          paystack.data.account_name
        );
        expect(PaystackHelpers.verifyAccountName).toHaveBeenCalled();
        expect(verified_user).toHaveProperty('is_verified', true);
      });
      it('throws an error when input bank is not nigerian', async () => {
        await expect(
          AccountMutations.createAccount({
            ...user,
            bank_name: 'CHASE BANK',
          })
        ).rejects.toThrow('We do not support this bank, please try another');
      });
    });

    describe('when mutation account_name is NOT within a levenshtein distance of 2', () => {
      const user = stubs.user();
      const paystack = stubs.paystack_success();

      it('throws an spelling check error', async () => {
        jest.spyOn(PaystackHelpers, 'verifyAccountName').mockResolvedValueOnce({
          ...paystack,
          data: { ...paystack.data, account_name: 'HAN DOE' },
        });
        await expect(AccountMutations.createAccount(user)).rejects.toThrow(
          'Please check the spelling of your account name and try again'
        );
      });
    });

    describe('when mutation account_name is within a levenshtein distance of 2', () => {
      const user = stubs.user();
      const paystack = stubs.paystack_success();

      it('verifies user', async () => {
        jest.spyOn(PaystackHelpers, 'verifyAccountName').mockResolvedValueOnce({
          ...paystack,
          data: { ...paystack.data, account_name: 'JOE DOE' },
        });

        const verified_user = await AccountMutations.createAccount(user);
        expect(verified_user).toHaveProperty('is_verified', true);
      });
    });

    describe('when mutation_account name has alternate casing from paystacks account_name', () => {
      it('verifies user in spite casing difference in mutation account_name and DEFAULT_USER', async () => {
        const user = {
          ...stubs.user(),
          name: 'john doe',
        };

        const verified_user = await AccountMutations.createAccount(user);
        expect(verified_user).toHaveProperty('is_verified', true);
        expect(verified_user).toHaveProperty('name', 'JOHN DOE');
      });
    });
  });

  describe('Mutation Two', () => {
    describe('when mutation account_number is present in the database', () => {
      const user = stubs.user();
      const paystack = stubs.paystack_success();

      it('is defined', () => {
        expect(AccountMutations.retrieveAccount).toBeDefined();
      });

      it('verifies user inputed account_name in database as opposed to paystacks', async () => {
        const fuzzy_user = {
          name: 'JOHN DO',
          id: Math.floor(1500 * Math.random()),
          is_verified: false,
        };

        jest.spyOn(DatabaseService, 'retrieveFuzzyUser').mockReturnValueOnce({
          ...user,
          ...fuzzy_user,
        });

        jest.spyOn(DatabaseService, 'modifyUser').mockReturnValueOnce({
          ...user,
          ...fuzzy_user,
        });

        const verified_user = await AccountMutations.retrieveAccount({
          account_number: user.account_number,
          bank_code: '033',
        });

        expect(PaystackHelpers.verifyAccountName).toHaveBeenCalled();
        expect(DatabaseService.retrieveFuzzyUser).toHaveBeenCalled();
        expect(verified_user).toHaveProperty('name', 'JOHN DO');
      });
    });

    describe('when mutation account_number NOT present in database', () => {
      const user = stubs.user();

      it('creates and verifies user', async () => {
        const verified_user = await AccountMutations.retrieveAccount({
          account_number: user.account_number,
          bank_code: '033',
        });
        expect(verified_user).toHaveProperty('is_verified', true);
        expect(verified_user).toHaveProperty('name', 'JOHN DOE');
      });
    });
  });
});
