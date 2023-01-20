/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Scenes, Markup } = require('telegraf');

import MESSAGES_AU from '../translate/messagesUA.json';
import { POSITIONS } from '../constants/positions';

import { createUser } from '../repository/createUser';

import { validateUserFirstName } from '../validators/validateUserFirstName';
import { validateUserLastName } from '../validators/validateUserLastName';
import { handleDelayedSendMessage } from '../utils/handleDelayedSendMessage';

export const registerNewUser = new Scenes.WizardScene(
  'registerNewUser',
  async (ctx: any): Promise<any> => {
    const chatId: number = ctx.update.callback_query.from.id;
    const userNickName: string = ctx.update.callback_query.from.first_name || ctx.update.callback_query.from.username;

    await ctx.reply(MESSAGES_AU.REGISTER_ENTER_NAME, { parse_mode: 'html' });

    // Add store 'userData' to collect entered user's data
    ctx.wizard.state.userData = {};
    ctx.wizard.state.userData.chatId = chatId;
    ctx.wizard.state.userData.userNickName = userNickName;

    // Go to next step
    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    // Here we have first message from user
    const firstName: string = ctx.message.text;
    const isFirstNameValid = validateUserFirstName(firstName);

    // Validate user first name
    if (!isFirstNameValid) {
      await ctx.reply(MESSAGES_AU.ERROR_FIRST_NAME, { parse_mode: 'html' });
      return;
    }

    // Set user first name
    const formatedUserFirstName = firstName.trim();
    ctx.wizard.state.userData.firstName = formatedUserFirstName;

    await ctx.reply(MESSAGES_AU.REGISTER_ENTER_LAST_NAME);
    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    const lastName: string = ctx.message.text;
    const isLastNameValid = validateUserLastName(lastName);

    // Validate user last name
    if (!isLastNameValid) {
      await ctx.reply(MESSAGES_AU.ERROR_FIRST_LAST_NAME, {
        parse_mode: 'html',
      });
      return;
    }

    // Set user last name
    const formatedUserLastName = lastName.trim();
    ctx.wizard.state.userData.lastName = formatedUserLastName;

    const keyboard = [
      [
        {
          text: MESSAGES_AU.SHARE_PHONE_NUMBER,
          request_contact: true,
        },
      ],
    ];

    await ctx.reply(MESSAGES_AU.SHARE_PHONE_BTN_TITLE, {
      reply_markup: { keyboard },
    });

    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    const userPhone: string = ctx?.update?.message?.contact?.phone_number;

    if (!userPhone) {
      await ctx.reply(MESSAGES_AU.ERROR_USER_PHONE, { parse_mode: 'html' });
      return;
    }

    // Set user phone
    ctx.wizard.state.userData.phone = userPhone;

    const keyboard = [
      [Markup.button.callback(POSITIONS.COSMETOLOGIST, POSITIONS.COSMETOLOGIST)],
      [Markup.button.callback(POSITIONS.DERMATOLOGIST, POSITIONS.DERMATOLOGIST)],
      [Markup.button.callback(POSITIONS.MASSEUR, POSITIONS.MASSEUR)],
      [Markup.button.callback(POSITIONS.CLINIC, POSITIONS.CLINIC)],
      [Markup.button.callback(POSITIONS.PERSON, POSITIONS.PERSON)],
    ];

    await ctx.reply(MESSAGES_AU.THANKS, { reply_markup: { remove_keyboard: true } });
    await ctx.reply(`${MESSAGES_AU.SET_YOUR_POSITION}`, Markup.inlineKeyboard(keyboard));
    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    const userPosition: string = ctx?.update?.callback_query?.data;

    // Validate user position
    if (!userPosition) {
      ctx.reply(MESSAGES_AU.ERROR_USER_POSITION, {
        parse_mode: 'html',
      });
      return;
    }

    // Set user position
    ctx.wizard.state.userData.position = userPosition;

    const sendCancelRegistrationBtn = () => {
      const keyboard = [[Markup.button.callback(MESSAGES_AU.DONE_REGISTRATION_BTN_TITLE, 'finishUserRegistration')]];
      ctx.reply(`${MESSAGES_AU.CANCEL_REGISTRATION}`, Markup.inlineKeyboard(keyboard));
    };

    if (userPosition === POSITIONS.PERSON) {
      await ctx.reply(MESSAGES_AU.FINISH_REGISTER_AS_PERSON, { parse_mode: 'html' });

      const userData = ctx.wizard.state.userData;
      await createUser(userData, ctx);

      // TODO: Send notification to admins
      return ctx.scene.leave();
    }

    await ctx.reply(MESSAGES_AU.DOWNLOAD_CERTIFICATE, { parse_mode: 'html' });

    await handleDelayedSendMessage({
      delayValue: 5000,
      ctx,
      action: sendCancelRegistrationBtn,
    });
  },

  async (ctx: any): Promise<any> => {
    console.log('[ctx]', ctx);

    return ctx.scene.leave();
  },
);
