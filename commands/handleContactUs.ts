/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import MESSAGES_AU from '../translate/messagesUA.json';

export const handleContactUs = async (ctx: any) => {
  return await ctx.reply(`${MESSAGES_AU.CONTACT_US_PARAGRAPH}`);
};
