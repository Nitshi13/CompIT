/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const axios = require('axios');

import MESSAGES_AU from '../translate/messagesUA.json';

export const getSeminarsShedule = async (ctx: any) => {
  let seminarsData = null;

  try {
    const { data, status } = await axios.get(`${process.env.PELART_SEMINARS_BASE_URL}?schedule=1`);

    if (status !== 200) {
      return await ctx.reply(`${MESSAGES_AU.ERROR_REQUEST_SEMINARS_SHEDULE}`);

      //TODO: Send notification to amdin
    }

    const { status: GoogleScriptStatus, data: GoogleSheetData } = data;

    if (GoogleScriptStatus !== 200) {
      return await ctx.reply(`${MESSAGES_AU.ERROR_REQUEST_SEMINARS_SHEDULE}`);

      //TODO: Send notification to amdin
    }

    seminarsData = GoogleSheetData;
  } catch (error) {
    return await ctx.reply(`${MESSAGES_AU.ERROR_REQUEST_SEMINARS_SHEDULE}`);

    //TODO: Send notification to amdin
  }

  return seminarsData;
};
