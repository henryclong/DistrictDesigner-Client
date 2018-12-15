import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../config/constants';

export const generatePassword = (password) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
};

export const validateAuth = (password, response) => {
  return bcrypt.compareSync(password, response['USER_KEY']);
}
