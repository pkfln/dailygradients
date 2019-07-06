import * as dotenv from 'dotenv';
import tinygradient from 'tinygradient';
import Jimp from 'jimp';
import got from 'got';

interface IGradient {
  name: string;
  colors: string[];
}

// Load .env
dotenv.config();

const IMAGE_WIDTH: number = parseInt(process.env.IMAGE_WIDTH!, 10);
const IMAGE_HEIGHT: number = parseInt(process.env.IMAGE_HEIGHT, 10);

setInterval(async () => {
  const whiteFont = await Jimp.loadFont('../fonts/apercu-mono-white.fnt');
  const blackFont = await Jimp.loadFont('../fonts/apercu-mono-black.fnt');

  const gradientsBody: string = (await got('https://raw.githubusercontent.com/ghosh/uiGradients/master/gradients.json')).body;
  const gradients: IGradient[] = JSON.parse(gradientsBody);

  const choosenGradient: IGradient = gradients[Math.random() * gradients.length | 0];
  const gradient: tinygradient.Instance = tinygradient(choosenGradient.colors);
  const rgb: tinycolor.Instance[] = gradient.rgb(IMAGE_WIDTH);

  const image: Jimp = new Jimp(IMAGE_WIDTH, IMAGE_HEIGHT);
  
  for (let x = 0; x < IMAGE_WIDTH; x++) {
    for (let y = 0; y < IMAGE_HEIGHT; y++) {
      image.setPixelColor(parseInt(rgb[x].toHex8(), 16), x, y);
    }
  }

  image.print(rgb[Math.round(IMAGE_WIDTH / 2)].isDark() ? whiteFont : blackFont, 0, 0,
    { text: choosenGradient.name, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, IMAGE_WIDTH, IMAGE_HEIGHT);

  image.write('../test.png');
}, 5000);
