/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Telegraf } = require('telegraf');

const token = process.env['PELART_BOT_API'];

// For example this Bot is available on https://t.me/PelartLaboratoryBot
export const bot = new Telegraf(token);

// Also you can do with helping @BotFather Bot:
// /setuserpic - change bot profile photo. Must be at least 150x150.
// /setdescription - change bot description
// /setabouttext - change bot about info
