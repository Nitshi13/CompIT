/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Scenes, session } = require('telegraf');

import { bot } from './config/telegram.config';
import { setBotCommands } from './utils/setBotCommands';
import { activateUserProfile } from './utils/activateUserProfile';
import { deactivateUserProfile } from './utils/deactivateUserProfile';
import { setUserDocument } from './utils/setUserDocument';
import { handleStartCommand } from './commands/handleStartCommand';
import { setAdmin } from './commands/setAdmin';
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

  // Actions handlers
  bot.action('registerNewUser', async (ctx: any): Promise<any> => {
    await ctx.scene.enter('registerNewUser');
  });

  // Update user role to Admin
  bot.hears(`set_admin_${process.env['ADMIN_SECRET_KEY']}`, async (ctx: any): Promise<any> => {
    await setAdmin(ctx);
  });

  // Bot waiting for any photo
  bot.on('photo', async (ctx: any): Promise<any> => {
    await setUserDocument(ctx);
  });

  // Bot hears any text and actions and matchig it
  bot.use(async (ctx: any) => {
    const actionFromButton: string = ctx?.update?.callback_query?.data || '';
    const isActivateUserAction: boolean = /^activate_user_id=/.test(actionFromButton);
    const isВDeactivateUserAction: boolean = /^deactivate_user_id=/.test(actionFromButton);

    if (isActivateUserAction) {
      await activateUserProfile(actionFromButton, ctx);
    } else if (isВDeactivateUserAction) {
      await deactivateUserProfile(actionFromButton, ctx);
    }
  });

  bot.launch();
};
