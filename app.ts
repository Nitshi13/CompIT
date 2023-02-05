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
import { addUserToSeminar } from './utils/addUserToSeminar';
import { sendAvailableReports } from './utils/sendAvailableReports';
import { handleContactAdmin } from './utils/handleContactAdmin';

import { handleStartCommand } from './commands/handleStartCommand';
import { setAdmin } from './commands/setAdmin';
import { updateAdmin } from './commands/updateAdmin';
import { sendCatalogButton } from './commands/sendCatalogButton';
import { sendProtocolsButtons } from './commands/sendProtocolsButtons';
import { handleContactUs } from './commands/handleContactUs';
import { sendNewProductsButton } from './commands/sendNewProductsButton';

import { registerNewUser } from './scenes/registerNewUser';
import { updateUserInfo } from './scenes/updateUserInfo';
import { seminarRegisterUser } from './scenes/seminarRegisterUser';
import { createMailing } from './scenes/createMailing';

import { handleReportNewUsers } from './reports/handleReportNewUsers';

import messagesUA from './translate/messagesUA.json';

const scenes = new Scenes.Stage([registerNewUser, updateUserInfo, seminarRegisterUser, createMailing]);

export const handleEvents = async (): Promise<any> => {
  await setBotCommands(bot);

  // Scenes
  bot.use(session());
  bot.use(scenes.middleware());

  // Menu commands handlers
  bot.start(async (ctx: any): Promise<any> => {
    await handleStartCommand({ ctx, messagesUA });
  });

  bot.command('catalog', async (ctx: any): Promise<any> => {
    await sendCatalogButton(ctx);
  });

  bot.command('protocols', async (ctx: any): Promise<any> => {
    await sendProtocolsButtons(ctx);
  });

  bot.command('seminars', async (ctx: any): Promise<any> => {
    await ctx.scene.enter('seminarRegisterUser');
  });

  bot.command('new_products', async (ctx: any): Promise<any> => {
    await sendNewProductsButton(ctx);
  });

  bot.command('contact_us', async (ctx: any): Promise<any> => {
    await handleContactUs(ctx);
  });

  // Scenes and actions handlers
  bot.action('registerNewUser', async (ctx: any): Promise<any> => {
    await ctx.scene.enter('registerNewUser');
  });

  bot.action('updateUserInfo', async (ctx: any): Promise<any> => {
    await ctx.scene.enter('updateUserInfo');
  });

  bot.action('createMailing', async (ctx: any): Promise<any> => {
    await ctx.scene.enter('createMailing');
  });

  bot.action('getAllReports', async (ctx: any): Promise<any> => {
    await sendAvailableReports(ctx);
  });

  bot.action('reportNewUsers', async (ctx: any): Promise<any> => {
    await handleReportNewUsers(ctx);
  });

  bot.action('contactAdmin', async (ctx: any): Promise<any> => {
    await handleContactAdmin(ctx);
  });

  // Update user role to Admin
  bot.hears(`set_admin_${process.env['ADMIN_SECRET_KEY']}`, async (ctx: any): Promise<any> => {
    await setAdmin(ctx);
  });

  // Update admin to user
  bot.hears(`update_admin_${process.env['ADMIN_SECRET_KEY']}`, async (ctx: any): Promise<any> => {
    await updateAdmin(ctx);
  });

  // Bot waiting for any photo
  bot.on('photo', async (ctx: any): Promise<any> => {
    await setUserDocument(ctx);
  });

  // Bot hears any text and actions and matchig it
  bot.use(async (ctx: any) => {
    const actionFromButton: string = ctx?.update?.callback_query?.data || '';
    const isActivateUserAction: boolean = /^activate_user_id=/.test(actionFromButton);
    const isDeactivateUserAction: boolean = /^deactivate_user_id=/.test(actionFromButton);
    const isUserRegisterToSeminar: boolean = /^add_user_to_seminar/.test(actionFromButton);

    if (isActivateUserAction) {
      await activateUserProfile(actionFromButton, ctx);
    } else if (isDeactivateUserAction) {
      await deactivateUserProfile(actionFromButton, ctx);
    } else if (isUserRegisterToSeminar) {
      await addUserToSeminar(actionFromButton, ctx);
    }
  });

  bot.launch();
};
