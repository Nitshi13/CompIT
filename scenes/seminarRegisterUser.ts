/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Scenes, Markup } = require('telegraf');
import { addHours, format } from 'date-fns';

import { getUser } from '../repository/getUser';

import { getSeminarsShedule } from '../utils/getSeminarsShedule';
import { ISeminarItem, prepareDataForSeminarsSchedule } from '../utils/prepareDataForSeminarsSchedule';
import { handleDelayedSendMessage } from '../utils/handleDelayedSendMessage';
import { sendRegisterBtn } from '../utils/sendRegisterBtn';

import MESSAGES_AU from '../translate/messagesUA.json';
import { POSITIONS } from '../constants/positions';

export const seminarRegisterUser = new Scenes.WizardScene(
  'seminarRegisterUser',
  async (ctx: any): Promise<any> => {
    await ctx.reply(`${MESSAGES_AU.LOADER}`);
    const chatId: number = ctx?.update?.message?.from?.id;

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

    await ctx.reply(`${MESSAGES_AU.SEMINARS_SHEDULE}`, Markup.inlineKeyboard(keyboard));

    // Add store 'seminarsData' to send them to next step
    ctx.wizard.state.userData = {};
    ctx.wizard.state.userData.seminars = filteredSeminarsData;
    ctx.wizard.state.userData.chatId = chatId;

    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    const checkedSeminar: string = ctx?.update?.callback_query?.data;

    if (!checkedSeminar) {
      await ctx.reply(`${MESSAGES_AU.OUT_SEMINAR_REGISTER}`);

      return ctx.scene.leave();
    }

    const selectedSeminarId: number = Number(checkedSeminar.replace('seminar_register=', ''));
    const { seminars, chatId } = ctx.wizard.state.userData;

    const selectedSeminarData = seminars.filter(({ id }) => id === selectedSeminarId)[0];
    const {
      date,
      time,
      format: seminarFormat,
      address,
      title,
      description,
      speaker,
      about_speaker,
      paid,
    } = selectedSeminarData;
    // TODO: Fix Date!
    const formattedDate = format(new Date(date), 'dd-MM-yyyy');
    const formattedTime = time.replace('-', ':');
    const isPaid = paid === 'Так' || paid === 'так' || paid === '+';

    let seminarDataToReply = `${MESSAGES_AU.SEMINARS_DETAILS}`;
    seminarDataToReply += `\n${MESSAGES_AU.DATE} ${formattedDate}`;
    seminarDataToReply += `\n${MESSAGES_AU.TIME} ${formattedTime}`;
    seminarDataToReply += `\n${MESSAGES_AU.FORMAT} ${seminarFormat}`;
    seminarDataToReply += `\n${MESSAGES_AU.ADDRESS} ${address}`;
    seminarDataToReply += `\n${MESSAGES_AU.PAID} ${isPaid ? MESSAGES_AU.YES : MESSAGES_AU.NO}`;

    seminarDataToReply += `\n\n${title}`;
    seminarDataToReply += `\n${description}`;

    seminarDataToReply += `\n\n${MESSAGES_AU.SPEAKER} ${speaker}`;
    seminarDataToReply += `\n${about_speaker}`;

    await ctx.reply(seminarDataToReply, { parse_mode: 'html' });

    const userData = await getUser({ chatId }, ctx);

    if (!userData) {
      await ctx.reply(MESSAGES_AU.ERROR_ACCESS_SEMINAR);

      await handleDelayedSendMessage({
        delayValue: 1000,
        ctx,
        action: sendRegisterBtn,
      });

      return ctx.scene.leave();
    }

    const { position, isActive, certificate } = userData;

    if (position === POSITIONS.PERSON) {
      await ctx.reply(MESSAGES_AU.ERROR_ACCESS_SEMINAR_FOR_PERSON);

      return ctx.scene.leave();
    }

    // Here we have specialist with not uploaded certificate
    if (!certificate) {
      await ctx.reply(MESSAGES_AU.ERROR_NOT_UPLOADED_SERTIFICATE);

      return ctx.scene.leave();
    }

    // Here we have specialist with not activated profile
    if (!isActive) {
      await ctx.reply(MESSAGES_AU.ERROR_NOT_ACTIVE_SPECIALIST_PROFILE);

      return ctx.scene.leave();
    }

    const keyboard = [
      [Markup.button.callback('Записатися на семінар', `add_user_to_seminar?date=${formattedDate}&time=${time}`)],
    ];

    await ctx.reply(`${MESSAGES_AU.REGISTER_USER_TO_SEMINAR}`, Markup.inlineKeyboard(keyboard));

    return ctx.scene.leave();
  },
);
