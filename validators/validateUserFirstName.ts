/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
export const validateUserFirstName = (firstName: string): boolean => {
    let result: null | boolean = null;

    const isMinLength: boolean = firstName.trim().length >= 2;
    const isDigits: boolean = /\d/.test(firstName);
    const isMultyWords: boolean = firstName.split(" ").length > 1;

    if (isMinLength && !isDigits && !isMultyWords) {
        return (result = true);
    }

    result = false;
    return result;
};
