/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import axios from 'axios';
import { bot } from '../config/telegram.config';

import MESSAGES_AU from '../translate/messagesUA.json';

export const handleUserDocument = async (ctx: any) => {
  // Get user donwloaded file
  const userFiles = ctx?.update?.message?.photo;
  const isUserFiles = userFiles && !!userFiles.length;
  let imageBase64: null | string = null;

  if (!isUserFiles) {
    await ctx.reply(MESSAGES_AU.ERROR_UPLOAD_FILE, { parse_mode: 'html' });

    return;
  }

  // Get last uploaded user's file id
  const { file_id } = userFiles[userFiles.length - 1];

  // Get file's url
  const { href: fileUrl } = await bot.telegram.getFileLink(file_id);

  // Donwload and encode user's file to
  try {
    const { status, data } = await axios.get(fileUrl, { responseType: 'arraybuffer' });

    if (status !== 200) {
      return await ctx.reply(MESSAGES_AU.ERROR_UPLOAD_FILE, { parse_mode: 'html' });
    }

    imageBase64 = Buffer.from(data).toString('base64');
  } catch (error) {
    await ctx.reply(MESSAGES_AU.ERROR_UPLOAD_FILE, { parse_mode: 'html' });
  }

  return { imageBase64, file_id };
};
