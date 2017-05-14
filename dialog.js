import {DIALOG_WIDTH, DIALOG_HEIGHT, DIALOG_X, DIALOG_Y, RED} from './constants.js';

export default class Dialog {
  constructor() {
    this.width = DIALOG_WIDTH;
    this.height = DIALOG_HEIGHT;
    this.x = DIALOG_X;
    this.y = DIALOG_Y;
    this.color = RED;
  }
};