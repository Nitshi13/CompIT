/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { IUser } from '../model/user.model';
import { ICertificate } from '../model/certificate.model';
import { getUser } from '../repository/getUser';
import { updateUser } from '../repository/updateUser';
import { createCertificate } from '../repository/createCertificate';

import { handleDelayedSendMessage } from './handleDelayedSendMessage';
import { sendRegisterBtn } from './sendRegisterBtn';
import { uppercaseWords } from './uppercaseWords';
import { handleUserDocument } from './handleUserDocument';
import { sendAdminNotificationUploadDocument } from './sendAdminNotificationUploadDocument';
import { sendUpdateUserInfoBtn } from './sendUpdateUserInfoBtn';

import MESSAGES_AU from '../translate/messagesUA.json';
import { POSITIONS } from '../constants/positions';

export const setUserDocument = async (ctx: any) => {
  const chatId = ctx.update.message.from.id;
  const userTelegramName = ctx.update.message.from.first_name || ctx.update.message.from.username;

  // Look for the same user in DB
  const userData: null | IUser = await getUser({ chatId }, ctx);

  if (!userData) {
    await ctx.reply(`${userTelegramName}, ${MESSAGES_AU.ERROR_UPLOAD_PHOTO_USER_DOES_NOT_EXIST}`, {
      parse_mode: 'html',
    });

    return await handleDelayedSendMessage({
      delayValue: 2000,
      ctx,
      action: sendRegisterBtn,
    });
  }

  const { firstName, certificate, position } = userData;

  if (position === POSITIONS.PERSON) {
    await ctx.reply(`${uppercaseWords(firstName)}, ${MESSAGES_AU.ERROR_UPLOAD_DOC_FOR_PERSON}`, {
      parse_mode: 'html',
    });

    return await sendUpdateUserInfoBtn(ctx);
  }

  if (certificate) {
    return await ctx.reply(`${uppercaseWords(firstName)}, ${MESSAGES_AU.ERROR_EXIST_CERTIFICATE}`, {
      parse_mode: 'html',
    });
  }

  const { imageBase64, file_id } = await handleUserDocument(ctx);

  if (!imageBase64 && !file_id) {
    return await ctx.reply(`${uppercaseWords(firstName)}, ${MESSAGES_AU.ERROR_TELEGRAM_HANDLE_DOCUMENT}`, {
      parse_mode: 'html',
    });
  }

  const createdCertificate: null | ICertificate = await createCertificate(
    { owner: userData, base64: imageBase64, telegramFileId: file_id },
    ctx,
  );

  if (!createdCertificate) {
    return await ctx.reply(MESSAGES_AU.ERROR_DB_REQUEST, { parse_mode: 'html' });
  }

  const updatedUserData: null | IUser = await updateUser({ chatId }, { certificate: createdCertificate }, ctx);

  if (!updatedUserData) {
    return await ctx.reply(MESSAGES_AU.ERROR_DB_REQUEST, { parse_mode: 'html' });
  }

  // Send notification to user
  await ctx.reply(MESSAGES_AU.SUCCESS_UPLOAD_DOCUMENT, { parse_mode: 'html' });

  return await sendAdminNotificationUploadDocument(updatedUserData, ctx);
};
