/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require('telegraf');
import { format } from 'date-fns';

import { getSeminarsShedule } from '../utils/getSeminarsShedule';
import { ISeminarItem, prepareDataForSeminarsSchedule } from '../utils/prepareDataForSeminarsSchedule';

import MESSAGES_AU from '../translate/messagesUA.json';

export const sendSeminarsSchedule = async (ctx: any) => {
  await ctx.reply(`${MESSAGES_AU.LOADER}`);

  // Get data from Google Sheets
  const seminarsData: Array<string[]> = await getSeminarsShedule(ctx);
  // Crate flat array contains seminars data objects
  const prepareDataForRender: Array<ISeminarItem> | [] = prepareDataForSeminarsSchedule(seminarsData);
  const isPreparedDataForRender: boolean = !!prepareDataForRender.length;

  if (!isPreparedDataForRender) {
    return await ctx.reply(`${MESSAGES_AU.ERROR_SEMINARS_SCHEDULE_EMPTY}`);
  }

  // Filter seminars data objects by current date and available status
  const filteredSeminarsData: Array<ISeminarItem> | [] = prepareDataForRender.filter(({ date, status }) => {
    const currentDate = new Date();
    const seminarDate = new Date(date);
    const isAvailableStatus = status === 'Ok' || status === 'ok' || status === 'Ок' || status === 'ок';

    return seminarDate >= currentDate && isAvailableStatus;
  });

  if (!filteredSeminarsData) {
    return await ctx.reply(`${MESSAGES_AU.ERROR_SEMINARS_SCHEDULE_EMPTY}`);
  }

  const keyboard = filteredSeminarsData.map(({ id, date, short_title }) => {
    const formattedDate = format(new Date(date), 'dd-MM');

    return [Markup.button.callback(`${formattedDate} ${short_title}`, `seminar_record=${id}`)];
  });

  return await ctx.reply(`${MESSAGES_AU.SEMINARS_SHEDULE}`, Markup.inlineKeyboard(keyboard));
};
