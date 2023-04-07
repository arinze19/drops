import { StringHelpers } from '../helpers';
import { User } from '../types';

class DatabaseService {
  private readonly users: User[] = [];

  createUser = (user: Omit<User, 'id' | 'is_verified'>): User => {
    const saved_user = {
      ...user,
      is_verified: false,
      id: Math.floor(1500 * Math.random()),
    };

    this.users.push(saved_user);

    return saved_user;
  };

  retrieveUser = (name: string): User | null => {
    const user = this.users.find((u) => u.name === name);
    if (!user) {
      return null;
    }

    return user;
  };

  retrieveUsers = () => {
    return this.users;
  };

  retrieveFuzzyUser = (name: string, tolerance = 2): User | null => {
    const user = this.users.find((u) =>
      StringHelpers.is_valid_levenshtein(u.name, name, tolerance)
    );

    if (!user) {
      return null;
    }

    return user;
  };

  modifyUser = (name: string, updated_user: Partial<User>): User | null => {
    const index = this.users.findIndex((u) => u.name === name);
    if (index < 0) return null;

    this.users.splice(index, 1, { ...this.users[index], ...updated_user });

    return this.users[index];
  };

  retrieveUsersCount = () => {
    return this.users.length;
  };
}

export default new DatabaseService();
