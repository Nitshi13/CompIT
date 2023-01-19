/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
export const validateUserLastName = (lastName: string): boolean => {
    let result: null | boolean = null;

    const isMinLength: boolean = lastName.trim().length >= 2;
    const isDigits: boolean = /\d/.test(lastName);
    const isMultyWords: boolean = lastName.split(" ").length > 1;

    if (isMinLength && !isDigits && !isMultyWords) {
        return (result = true);
    }

    result = false;
    return result;
};
