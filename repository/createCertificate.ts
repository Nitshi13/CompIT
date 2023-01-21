/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { CertificateModel, ICertificate } from '../model/certificate.model';

import MESSAGES_AU from '../translate/messagesUA.json';

export const createCertificate = async (certificate, ctx: any): Promise<ICertificate> => {
  let certificateData: null | ICertificate = null;

  try {
    certificateData = await CertificateModel.create(certificate);
  } catch (error) {
    console.log('[error => createCertificate] :::', error.message);
    await ctx.reply(MESSAGES_AU.ERROR_DB_REQUEST, { parse_mode: 'html' });
  }

  return certificateData;
};
