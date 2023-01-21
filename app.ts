/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Scenes, session } = require('telegraf');

import { bot } from './config/telegram.config';
import { setBotCommands } from './utils/setBotCommands';
import { handleStartCommand } from './commands/handleStartCommand';
import { registerNewUser } from './scenes/registerNewUser';

import messagesUA from './translate/messagesUA.json';

const registerNewUserStages = new Scenes.Stage([registerNewUser]);

export const handleEvents = async (): Promise<any> => {
  await setBotCommands(bot);

  // Scenes
  bot.use(session());
  bot.use(registerNewUserStages.middleware());

  // Menu commands handlers
  bot.start(async (ctx: any): Promise<any> => {
    await handleStartCommand({ ctx, messagesUA });
  });

  // bot.command("setlanguage", async (ctx: any): Promise<any> => {
  //     await sendLanguageKeyboard({ ctx });
  // });

  // bot.command("catalog", async (ctx: any): Promise<any> => {
  //     await sendCatalogButton({ ctx });
  // });

  // // Actions handlers
  bot.action('registerNewUser', async (ctx: any) => {
    await ctx.scene.enter('registerNewUser');
  });

  bot.launch();
};
