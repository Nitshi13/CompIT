/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Scenes, Markup } = require('telegraf');
import axios from 'axios';

import { bot } from '../config/telegram.config';

import MESSAGES_AU from '../translate/messagesUA.json';
import { POSITIONS } from '../constants/positions';

import { createUser } from '../repository/createUser';

import { validateUserFirstName } from '../validators/validateUserFirstName';
import { validateUserLastName } from '../validators/validateUserLastName';
import { handleDelayedSendMessage } from '../utils/handleDelayedSendMessage';
import { sendAdminNotificationNewUser } from '../utils/sendAdminNotificationNewUser';
import { IUser } from '../model/user.model';

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

    await ctx.reply(MESSAGES_AU.SHARE_PHONE_PARAGRAPH, {
      reply_markup: { keyboard },
    });
    await ctx.reply(MESSAGES_AU.SHARE_PHONE_PARAGRAPH_2, { parse_mode: 'html' });

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

    await ctx.reply(MESSAGES_AU.ONE_SEC, { parse_mode: 'html' });

    // Set user position
    ctx.wizard.state.userData.position = userPosition;

    const sendCancelRegistrationBtn = () => {
      const keyboard = [[Markup.button.callback(MESSAGES_AU.DONE_REGISTRATION_BTN_TITLE, 'finishUserRegistration')]];
      ctx.reply(`${MESSAGES_AU.CANCEL_REGISTRATION}`, Markup.inlineKeyboard(keyboard));
    };

    if (userPosition === POSITIONS.PERSON) {
      await ctx.reply(MESSAGES_AU.FINISH_REGISTER_AS_PERSON, { parse_mode: 'html' });

      const userData = ctx.wizard.state.userData;
      const createdUserData: IUser = await createUser(userData, ctx);
      await sendAdminNotificationNewUser(createdUserData, ctx);

      return ctx.scene.leave();
    }

    await ctx.reply(MESSAGES_AU.DOWNLOAD_CERTIFICATE, { parse_mode: 'html' });

    await handleDelayedSendMessage({
      delayValue: 1000,
      ctx,
      action: sendCancelRegistrationBtn,
    });

    return ctx.wizard.next();
  },

  async (ctx: any): Promise<any> => {
    const finishUserRegistration: string = ctx?.update?.callback_query?.data;

    // If user press the buuton "Finish registration"
    if (finishUserRegistration) {
      const userData = ctx.wizard.state.userData;
      const createdUserData = await createUser(userData, ctx);

      if (!createdUserData) {
        await ctx.reply(MESSAGES_AU.ERROR_DB_REQUEST, { parse_mode: 'html' });

        return ctx.scene.leave();
      }

      await ctx.reply(MESSAGES_AU.SUCCESS_CREATE_USER, { parse_mode: 'html' });

      return ctx.scene.leave();
    }

    // Get user donwloaded file
    const userFiles = ctx?.update?.message?.photo;
    const isUserFiles = userFiles && !!userFiles.length;

    if (!isUserFiles) {
      await ctx.reply(MESSAGES_AU.ERROR_UPLOAD_FILE, { parse_mode: 'html' });
    }

    // Get last uploaded user's file id
    const { file_id } = userFiles[userFiles.length - 1];
    // Get file's url
    const { href: fileUrl } = await bot.telegram.getFileLink(file_id);

    // Donwload and encode user's file to
    let imageBase64: null | string = null;

    try {
      const { status, data } = await axios.get(fileUrl, { responseType: 'arraybuffer' });

      if (status !== 200) {
        return await ctx.reply(MESSAGES_AU.ERROR_UPLOAD_FILE, { parse_mode: 'html' });
      }

      imageBase64 = Buffer.from(data).toString('base64');
    } catch (error) {
      await ctx.reply(MESSAGES_AU.ERROR_UPLOAD_FILE, { parse_mode: 'html' });
    }

    // Append user file (base64) to userData
    ctx.wizard.state.userData.certificate = imageBase64;
    const userData = ctx.wizard.state.userData;

    const createdUserData = await createUser(userData, ctx);

    if (!createdUserData) {
      await ctx.reply(MESSAGES_AU.ERROR_DB_REQUEST, { parse_mode: 'html' });

      return ctx.scene.leave();
    }

    await sendAdminNotificationNewUser(createdUserData, ctx);
    await ctx.reply(MESSAGES_AU.SUCCESS_CREATE_SPECIALIST, { parse_mode: 'html' });

    return ctx.scene.leave();
  },
);
