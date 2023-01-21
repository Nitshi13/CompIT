/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { model, Schema, Model, Document, Types } from 'mongoose';

import { ICertificate } from './certificate.model';

import { POSITIONS } from '../constants/positions';
import { USER_ROLES } from '../constants/userRoles';

export interface IUser extends Document {
  chatId: number;
  userNickName: string;
  firstName: string;
  lastName: string;
  phone: string;
  position: string;
  certificate?: ICertificate;
  isActive: boolean;
  userRole: string;
  // logs: Array<object>;
}

const UserSchema: Schema = new Schema(
  {
    chatId: { type: Number, required: true, unique: true },
    userNickName: {
      type: String,
      required: true,
      unique: false,
      maxLength: 150,
      set: (userNickName: string) => userNickName.toLowerCase(),
    },
    firstName: {
      type: String,
      required: true,
      unique: false,
      minLength: 2,
      maxLength: 150,
      set: (firstName: string) => firstName.toLowerCase(),
    },
    lastName: {
      type: String,
      required: true,
      unique: false,
      minLength: 2,
      maxLength: 150,
      set: (lastName: string) => lastName.toLowerCase(),
    },
    phone: {
      type: String,
      required: true,
      unique: false,
      minLength: 10,
      maxLength: 50,
    },
    position: {
      type: String,
      required: true,
      enum: [POSITIONS.COSMETOLOGIST, POSITIONS.DERMATOLOGIST, POSITIONS.MASSEUR, POSITIONS.CLINIC, POSITIONS.PERSON],
    },
    certificate: { type: Types.ObjectId, ref: 'Certificate' },
    isActive: {
      type: Boolean,
      required: true,
      unique: false,
      default: false,
    },
    userRole: {
      type: String,
      required: true,
      enum: [USER_ROLES.ADMIN, USER_ROLES.USER],
      default: USER_ROLES.USER,
    },
  },
  { timestamps: true },
);

export const UserModel: Model<IUser> = model<IUser>('User', UserSchema);
