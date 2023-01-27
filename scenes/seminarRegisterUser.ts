/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Scenes, Markup } = require('telegraf');
import { format } from 'date-fns';

import { getSeminarsShedule } from '../utils/getSeminarsShedule';
import { ISeminarItem, prepareDataForSeminarsSchedule } from '../utils/prepareDataForSeminarsSchedule';

import MESSAGES_AU from '../translate/messagesUA.json';

export const seminarRegisterUser = new Scenes.WizardScene(
  'seminarRegisterUser',
  async (ctx: any): Promise<any> => {
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

    const keyboard = filteredSeminarsData.map(({ id, date, short_title }) => {
      const formattedDate = format(new Date(date), 'dd-MM');

      return [Markup.button.callback(`${formattedDate} ${short_title}`, `seminar_register=${id}`)];
    });

    await ctx.reply(`${MESSAGES_AU.SEMINARS_SHEDULE}`, Markup.inlineKeyboard(keyboard));

    // Add store 'seminarsData' to send them to next step
    ctx.wizard.state.userData = {};
    ctx.wizard.state.userData.seminars = filteredSeminarsData;

    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    const userPosition: string = ctx?.update?.callback_query?.data;

    if (!userPosition) {
      await ctx.reply(`${MESSAGES_AU.ERROR_USER_SELECT_SEMINAR}`);
      return;
    }

    const selectedSeminarId: number = Number(userPosition.replace('seminar_register=', ''));
    const { seminars } = ctx.wizard.state.userData;

    const selectedSeminarData = seminars.filter(({ id }) => id === selectedSeminarId)[0];
    const { date, time, format: seminarFormat, address } = selectedSeminarData;
    const formattedDate = format(new Date(date), 'dd-MM-yyyy');
    const formattedTime = time.replace('-', ':');

    let seminarDataToReply = `${MESSAGES_AU.SEMINARS_DETAILS}`;
    seminarDataToReply += `\n${MESSAGES_AU.DATE} ${formattedDate}`;
    seminarDataToReply += `\n${MESSAGES_AU.TIME} ${formattedTime}`;
    seminarDataToReply += `\n${MESSAGES_AU.FORMAT} ${seminarFormat}`;
    seminarDataToReply += `\n${MESSAGES_AU.ADDRESS} ${address}`;

    await ctx.reply(seminarDataToReply);

    return ctx.scene.leave();
  },
);
