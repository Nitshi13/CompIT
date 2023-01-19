/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Scenes } = require("telegraf");

import MESSAGES_AU from "../translate/messagesUA.json";

import { validateUserFirstName } from "../validators/validateUserFirstName";
import { validateUserLastName } from "../validators/validateUserLastName";

export const registerNewUser = new Scenes.WizardScene(
    "registerNewUser",
    (ctx: any) => {
        ctx.reply(MESSAGES_AU.REGISTER_ENTER_NAME, { parse_mode: "html" });

        // Add store 'userData' to collect entered user's data
        ctx.wizard.state.userData = {};

        // Go to next step
        return ctx.wizard.next();
    },

    (ctx: any) => {
        // Here we have first message from user
        const firstName: string = ctx.message.text;
        const isFirstNameValid = validateUserFirstName(firstName);

        // Validate user first name
        if (!isFirstNameValid) {
            ctx.reply(MESSAGES_AU.ERROR_FIRST_NAME, { parse_mode: "html" });
            return;
        }

        // Set user first name
        const formatedUserFirstName = firstName.trim();
        ctx.wizard.state.userData.firstName = formatedUserFirstName;

        ctx.reply(MESSAGES_AU.REGISTER_ENTER_LAST_NAME);
        return ctx.wizard.next();
    },

    async (ctx: any) => {
        const lastName: string = ctx.message.text;
        const isLastNameValid = validateUserLastName(lastName);

        // Validate user last name
        if (!isLastNameValid) {
            ctx.reply(MESSAGES_AU.ERROR_FIRST_LAST_NAME, {
                parse_mode: "html",
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

        ctx.reply(MESSAGES_AU.SHARE_PHONE_BTN_TITLE, {
            reply_markup: { keyboard },
        });

        return ctx.wizard.next();
    },

    (ctx: any) => {
        // Here we have first message from user
        const userPhone: string = ctx?.update?.message?.contact?.phone_number;

        if (!userPhone) {
            ctx.reply(MESSAGES_AU.ERROR_USER_PHONE, { parse_mode: "html" });
            return;
        }

        // Set user phone
        ctx.wizard.state.userData.phone = userPhone;

        // TODO: Send key board with user's positions
        // ctx.reply(MESSAGES_AU.REGISTER_ENTER_LAST_NAME);
        return ctx.wizard.next();
    },

    async (ctx: any) => {
        const lastName: string = ctx.message.text;
        const isLastNameValid = validateUserLastName(lastName);

        // Validate user last name
        if (!isLastNameValid) {
            ctx.reply(MESSAGES_AU.ERROR_FIRST_LAST_NAME, {
                parse_mode: "html",
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

        ctx.reply(MESSAGES_AU.SHARE_PHONE_BTN_TITLE, {
            reply_markup: { keyboard },
        });

        return ctx.scene.leave();
    }
);

// ctx.reply('😉', { reply_markup: { remove_keyboard: true } });
