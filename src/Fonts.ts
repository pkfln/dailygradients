import Jimp from 'jimp';

export const FONT_PATH: string = './fonts/';

export default class Fonts {
  private whiteFont: any = null;
  private blackFont: any = null;

  public async loadFonts(): Promise<void> {
    this.whiteFont = await Jimp.loadFont(`${FONT_PATH}apercu-mono-white.fnt`);
    this.blackFont = await Jimp.loadFont(`${FONT_PATH}apercu-mono-black.fnt`);
  }

  public get white(): any {
    if (!this.whiteFont)
      throw new Error('Apercu Mono White hasn\'t been loaded yet.');

    return this.whiteFont;
  }

  public get black(): any {
    if (!this.blackFont)
      throw new Error('Apercu Mono Black hasn\'t been loaded yet.');

    return this.blackFont;
  }
}
