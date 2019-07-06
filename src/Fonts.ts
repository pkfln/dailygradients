import Jimp from 'jimp';

export const FONT_PATH: string = '../fonts/';

export default class Fonts {
  private white: any = null;
  private black: any = null;

  public async loadFonts(): Promise<void> {
    this.white = await Jimp.loadFont(`${FONT_PATH}apercu-mono-white.fnt`);
    this.black = await Jimp.loadFont(`${FONT_PATH}apercu-mono-black.fnt`);
  }

  public get getWhite(): any {
    if (!this.white)
      throw new Error('Apercu Mono White hasn\'t been loaded yet.');

    return this.white;
  }

  public get getBlack(): any {
    if (!this.black)
      throw new Error('Apercu Mono Black hasn\'t been loaded yet.');

    return this.black;
  }
}