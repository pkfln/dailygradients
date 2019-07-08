import Schedule from 'node-schedule';
import './dotenv';
import Twitter from './Twitter';
import Fonts from './Fonts';
import UIGradients, { IGradient } from './UIGradients';

export default class DailyGradients {
  private twitter: Twitter;
  private fonts: Fonts;

  public imageWidth: number;
  public imageHeight: number;

  constructor() {
    this.twitter = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY!,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
      access_token: process.env.TWITTER_ACCESS_TOKEN!,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    });

    this.fonts = new Fonts();
    this.fonts.loadFonts();

    this.imageWidth = parseInt(process.env.IMAGE_WIDTH!, 10);
    this.imageHeight = parseInt(process.env.IMAGE_HEIGHT!, 10);
    
    Schedule.scheduleJob(process.env.CRONTIME!, () => this.schelduledTask());
    console.log('>> Task scheduled. Waiting...');
  }

  private async schelduledTask(): Promise<void> {
    const gradients: IGradient[] = await UIGradients.fetchGradients();
    const gradient: IGradient = gradients[Math.random() * gradients.length | 0];
    const generatedImage: string = await UIGradients.generateImageBase64(gradient, this.fonts, this.imageWidth, this.imageHeight);
    const fragment: string = gradient.name.trim().replace(' ', '');
    const statusText: string = `${gradient.name} - ${gradient.colors.map(c => c.toUpperCase()).join(', ')}\n\nhttps://uigradients.com/#${fragment}`;

    await this.twitter.postImage(generatedImage, statusText);
    console.log('>> New gradient posted.');
  }
}
