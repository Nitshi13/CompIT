/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import MESSAGES_AU from '../translate/messagesUA.json';

export const addUserToSeminar = async (actionFromButton: string, ctx: any): Promise<any> => {
  await ctx.reply(`${MESSAGES_AU.LOADER}`);
  const chatId: number = ctx?.update?.callback_query?.from?.id;
  const seminarId = actionFromButton.replace('add_user_to_seminar_id=', '');

  console.log('[seminarId]', seminarId);
  console.log('[chatId]', chatId);

  // TODO: Get user data and post it to Google Sheet
};
