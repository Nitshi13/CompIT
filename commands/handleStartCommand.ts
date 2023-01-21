/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { IUser } from '../model/user.model';

import { sendRegisterBtn } from '../utils/sendRegisterBtn';
import { handleDelayedSendMessage } from '../utils/handleDelayedSendMessage';
import { IMessages } from '../interfaces/IMessage';

import { getUser } from '../repository/getUser';

export const handleStartCommand = async (options: { ctx: any; messagesUA: IMessages }): Promise<any> => {
  const { ctx, messagesUA } = options;
  const chatId: number = ctx.chat.id;
  const { first_name } = ctx.from;

  // Look for the same User in DB
  const userData: null | IUser = await getUser({ chatId }, ctx);

  // New User actions
  if (!userData) {
    await ctx.reply(`${first_name}, ${messagesUA.START_MESSAGE_1_NEW_USER}`);

    await handleDelayedSendMessage({
      delayValue: 1000,
      ctx,
      message: `${messagesUA.START_MESSAGE_2_NEW_USER}`,
    });

    await handleDelayedSendMessage({
      delayValue: 3000,
      ctx,
      message: `${messagesUA.START_MESSAGE_3_NEW_USER}`,
    });

    await handleDelayedSendMessage({
      delayValue: 7000,
      ctx,
      message: `${messagesUA.START_MESSAGE_4_NEW_USER}`,
    });

    await handleDelayedSendMessage({
      delayValue: 10000,
      ctx,
      message: `${messagesUA.START_MESSAGE_5_NEW_USER}`,
    });

    await handleDelayedSendMessage({
      delayValue: 5000,
      ctx,
      action: sendRegisterBtn,
    });
  }
};
