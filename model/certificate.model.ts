/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { model, Schema, Model, Document, Types } from 'mongoose';

import { IUser } from './user.model';

export interface ICertificate extends Document {
  owner: IUser;
  base64: string;
  telegramFileId: string;
}

const CertificateSchema: Schema = new Schema(
  {
    owner: { type: Types.ObjectId, ref: 'User' },
    base64: {
      type: String,
      required: false,
      unique: false,
    },
    telegramFileId: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true },
);

export const CertificateModel: Model<ICertificate> = model<ICertificate>('Certificate', CertificateSchema);
