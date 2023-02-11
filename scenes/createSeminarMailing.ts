/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Scenes, Markup } = require('telegraf');
import { addHours, format } from 'date-fns';

import { bot } from '../config/telegram.config';

import { handleUserDocument } from '../utils/handleUserDocument';
import { getSeminarsShedule } from '../utils/getSeminarsShedule';
import { ISeminarItem, prepareDataForSeminarsSchedule } from '../utils/prepareDataForSeminarsSchedule';

import MESSAGES_AU from '../translate/messagesUA.json';
import { getUsers } from '../repository/getUsers';
import { POSITIONS } from '../constants/positions';

export const createSeminarMailing = new Scenes.WizardScene(
  'createSeminarMailing',

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
    await ctx.reply(`${MESSAGES_AU.LOADER}`);

    // Get data from Google Sheets
    const seminarsData: Array<string[]> = await getSeminarsShedule(ctx);
    // Crate flat array contains seminars data objects
    const prepareDataForRender: Array<ISeminarItem> | [] = prepareDataForSeminarsSchedule(seminarsData);
    const isPreparedDataForRender: boolean = !!prepareDataForRender.length;

    if (!isPreparedDataForRender) {
      await ctx.reply(`${MESSAGES_AU.ERROR_SEMINARS_SCHEDULE_EMPTY}`);
      return ctx.scene.leave();
    }

    // Filter seminars data objects by current date and available status (Ok)
    const filteredSeminarsData: Array<ISeminarItem> | [] = prepareDataForRender.filter(({ date, status }) => {
      const currentDate = new Date();
      const seminarDate = new Date(date);
      const isAvailableStatus = status === 'Ok' || status === 'ok' || status === 'Ок' || status === 'ок';

      return seminarDate >= currentDate && isAvailableStatus;
    });

    if (!filteredSeminarsData) {
      await ctx.reply(`${MESSAGES_AU.ERROR_SEMINARS_SCHEDULE_EMPTY}`);
      return ctx.scene.leave();
    }

    const keyboard = filteredSeminarsData.map(({ id, date, title }) => {
      const formattedDate = format(addHours(new Date(date), 2), 'dd-MM');

      return [Markup.button.callback(`${formattedDate} ${title}`, `seminar_register=${id}`)];
    });

    await ctx.reply(`${MESSAGES_AU.CHECK_SEMINAR}`, Markup.inlineKeyboard(keyboard));

    ctx.wizard.state.mailingData.seminars = filteredSeminarsData;

    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    const checkedSeminar: string = ctx?.update?.callback_query?.data;

    if (!checkedSeminar) {
      await ctx.reply(MESSAGES_AU.ERROR_CHECK_SEMINAR_BTN);
      return;
    }

    const { seminars, imageId, message, chatId } = ctx.wizard.state.mailingData;

    const selectedSeminarId: number = Number(checkedSeminar.replace('seminar_register=', ''));
    const selectedSeminarData = seminars.filter(({ id }) => id === selectedSeminarId)[0];
    const { date, time } = selectedSeminarData;

    const formattedDate = format(addHours(new Date(date), 2), 'dd-MM');

    const btnRegisterToSeminar = [
      [Markup.button.callback('Записатися на семінар', `add_user_to_seminar?date=${formattedDate}&time=${time}`)],
    ];

    ctx.wizard.state.mailingData.btnRegisterToSeminar = btnRegisterToSeminar;

    await ctx.reply(MESSAGES_AU.YOUR_MESSAGE_WILL_BE);

    if (!imageId) {
      await bot.telegram.sendMessage(chatId, message);
    } else {
      await bot.telegram.sendPhoto(chatId, imageId, { caption: `${message}` });
    }

    await ctx.reply(`${MESSAGES_AU.REGISTER_USER_TO_SEMINAR}`, Markup.inlineKeyboard(btnRegisterToSeminar));

    const keyboard = [
      [
        Markup.button.callback(MESSAGES_AU.YES, 'successMailing'),
        Markup.button.callback(MESSAGES_AU.NO, 'cancelMailing'),
      ],
    ];

    await ctx.reply(`${MESSAGES_AU.ACCEPT_MESSAGE}`, Markup.inlineKeyboard(keyboard));

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

    const specialists = await getUsers(
      { position: { $in: [POSITIONS.COSMETOLOGIST, POSITIONS.CLINIC, POSITIONS.DERMATOLOGIST, POSITIONS.MASSEUR] } },
      ctx,
    );
    const { imageId, message, btnRegisterToSeminar } = ctx.wizard.state.mailingData;

    for (let i = 0; i < specialists.length; i++) {
      const { chatId } = specialists[i];
      if (!imageId) {
        try {
          await bot.telegram.sendMessage(chatId, message);
        } catch (error) {
          console.log('[error.message]', error.message);
        }
      } else {
        try {
          await bot.telegram.sendPhoto(chatId, imageId, { caption: `${message}` });
        } catch (error) {
          console.log('[error.message]', error.message);
        }
      }

      try {
        await bot.telegram.sendMessage(
          chatId,
          MESSAGES_AU.REGISTER_USER_TO_SEMINAR,
          Markup.inlineKeyboard(btnRegisterToSeminar),
        );
      } catch (error) {
        console.log('[error.message]', error.message);
      }
    }

    await ctx.reply(MESSAGES_AU.SUCCESS_MAILING);

    return ctx.scene.leave();
  },
);
