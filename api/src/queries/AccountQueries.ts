import db from '../db/DatabaseService';
import { User } from '../types';

export default class AccountQueries {
  static retrieveUsers(): User[] {
    return db.retrieveUsers();
  }
}
