import got from 'got';
import Jimp from 'jimp';
import tinygradient from 'tinygradient';
import Fonts from './Fonts';

export interface IGradient {
  name: string;
  colors: string[];
}

export default abstract class UIGradients {
  public static async fetchGradients(): Promise<IGradient[]> {
    const gradients: string = (await got('https://raw.githubusercontent.com/ghosh/uiGradients/master/gradients.json')).body;
    return JSON.parse(gradients);
  }

  public static async generateImageBase64(gradient: IGradient, fonts: Fonts, width: number, height: number): Promise<string> {
    const tgInstance: tinygradient.Instance = tinygradient(gradient.colors);
    const tcInstance: tinycolor.Instance[] = tgInstance.rgb(width);
    const image: Jimp = new Jimp(width, height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        image.setPixelColor(parseInt(tcInstance[x].toHex8(), 16), x, y);
      }
    }

    image.print(tcInstance[Math.round(width / 2)].isDark() ? fonts.white : fonts.black, 0, 0, {
      text: gradient.name,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, width, height);

    return (await image.getBase64Async('image/png')).replace('data:image/png;base64,', '');
  }
}
