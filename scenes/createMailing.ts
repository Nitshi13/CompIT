/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Scenes, Markup } = require('telegraf');

import { bot } from '../config/telegram.config';

import { handleUserDocument } from '../utils/handleUserDocument';

import MESSAGES_AU from '../translate/messagesUA.json';
import { getUsers } from '../repository/getUsers';

export const createMailing = new Scenes.WizardScene(
  'createMailing',
  async (ctx: any): Promise<any> => {
    const chatId = ctx?.update?.callback_query?.from?.id;
    await ctx.reply(MESSAGES_AU.MAILING_SCENE_UPLOAD_IMAGE);

    const keyboard = [[Markup.button.callback(MESSAGES_AU.SKIP_STEP, 'skipUploadPhoto')]];

    ctx.reply(`${MESSAGES_AU.SKIP_UPLOAD_IMAGE_MSG}`, Markup.inlineKeyboard(keyboard));

    ctx.wizard.state.mailingData = {};
    ctx.wizard.state.mailingData.chatId = chatId;

    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    const userSkipUploadImg: string = ctx?.update?.callback_query?.data;

    await ctx.reply(MESSAGES_AU.MAILING_SCENE_ADD_TEXT);

    if (!userSkipUploadImg) {
      // Handle user document (photo)
      const { file_id } = await handleUserDocument(ctx);

      ctx.wizard.state.mailingData.imageId = file_id;
    }

    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    const mailingMessage: string = ctx?.message?.text;

    if (!mailingMessage) {
      await ctx.reply(MESSAGES_AU.ERROR_MAILING_SCENE_ADD_TEXT);
      return;
    }

    ctx.wizard.state.mailingData.message = mailingMessage;

    const { chatId, imageId } = ctx.wizard.state.mailingData;

    await ctx.reply(MESSAGES_AU.YOUR_MESSAGE_WILL_BE);

    if (!imageId) {
      await bot.telegram.sendMessage(chatId, mailingMessage);
    } else {
      await bot.telegram.sendPhoto(chatId, imageId, { caption: `${mailingMessage}` });
    }

    const keyboard = [
      [
        Markup.button.callback(MESSAGES_AU.YES, 'successMailing'),
        Markup.button.callback(MESSAGES_AU.NO, 'cancelMailing'),
      ],
    ];

    ctx.reply(`${MESSAGES_AU.ACCEPT_MESSAGE}`, Markup.inlineKeyboard(keyboard));

    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    const selectedAction: string = ctx?.update?.callback_query?.data;

    if (!selectedAction) {
      await ctx.reply(MESSAGES_AU.ERROR_CHECK_BTN);
      return;
    }

    if (selectedAction === 'cancelMailing') {
      await ctx.reply(MESSAGES_AU.CANCEL_MAILING);

      return ctx.scene.leave();
    }

    const users = await getUsers({}, ctx);
    const { imageId, message } = ctx.wizard.state.mailingData;

    for (let i = 0; i < users.length; i++) {
      const { chatId } = users[i];

      if (!imageId) {
        await bot.telegram.sendMessage(chatId, message);
      } else {
        await bot.telegram.sendPhoto(chatId, imageId, { caption: `${message}` });
      }
    }

    await ctx.reply(MESSAGES_AU.SUCCESS_MAILING);

    return ctx.scene.leave();
  },
);
