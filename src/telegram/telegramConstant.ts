import { Markup } from 'telegraf';

export enum TStart {
  y = 'y',
  n = 'n',
}

export const welcomeMessage = 'Are you ready to play the game?';
export const yesNoButtons = Markup.inlineKeyboard(
  [
    Markup.button.callback('Yup!', TStart.y),
    Markup.button.callback('Nope!', TStart.n),
  ],
  {
    columns: 2,
  },
);
