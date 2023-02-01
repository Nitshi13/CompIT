/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { addMonths } from 'date-fns';

import { IUser } from '../model/user.model';

import { getUsers } from '../repository/getUsers';

import { POSITIONS } from '../constants/positions';

import MESSAGES_AU from '../translate/messagesUA.json';

export const handleReportNewUsers = async (ctx: any) => {
  await ctx.reply(`${MESSAGES_AU.LOADER}`);

  const periodStart: Date = addMonths(new Date(), -1);
  const periodEnd: Date = new Date();

  const users: Array<IUser> = await getUsers(
    {
      createdAt: {
        $gte: periodStart,
        $lt: periodEnd,
      },
    },
    ctx,
  );

  const cosmetologists: Array<IUser> = users.filter(({ position }) => position === POSITIONS.COSMETOLOGIST);
  const masseurs: Array<IUser> = users.filter(({ position }) => position === POSITIONS.MASSEUR);
  const dermatologists: Array<IUser> = users.filter(({ position }) => position === POSITIONS.DERMATOLOGIST);
  const clinics: Array<IUser> = users.filter(({ position }) => position === POSITIONS.CLINIC);
  const persons: Array<IUser> = users.filter(({ position }) => position === POSITIONS.PERSON);

  const usersTotalCount: number = users.length;
  const cosmetologistsTotalCount: number = cosmetologists.length;
  const masseursTotalCount: number = masseurs.length;
  const dermatologistsTotalCount: number = dermatologists.length;
  const clinicsTotalCount: number = clinics.length;
  const personsTotalCount: number = persons.length;

  let messageToReply: string = `${MESSAGES_AU.REPORT_NEW_USERS_MONTH_TOTAL} ${usersTotalCount}`;
  messageToReply += `\n${MESSAGES_AU.OF_THEM}`;
  messageToReply += `\n${MESSAGES_AU.REPORT_NEW_USERS_MONTH_COSMETOLOGIST} ${cosmetologistsTotalCount}`;
  messageToReply += `\n${MESSAGES_AU.REPORT_NEW_USERS_MONTH_MASSEURS} ${masseursTotalCount}`;
  messageToReply += `\n${MESSAGES_AU.REPORT_NEW_USERS_MONTH_DERMATOLOGISTS} ${dermatologistsTotalCount}`;
  messageToReply += `\n${MESSAGES_AU.REPORT_NEW_USERS_MONTH_CLINICS} ${clinicsTotalCount}`;
  messageToReply += `\n${MESSAGES_AU.REPORT_NEW_USERS_MONTH_PERSONS} ${personsTotalCount}`;

  return await ctx.reply(messageToReply, { parse_mode: 'html' });
};
