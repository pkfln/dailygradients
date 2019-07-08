import Twit, { PromiseResponse } from 'twit';

interface IMetaParams {
  media_id: string;
  alt_text: { text: string };
}

interface IStatusParams {
  status: string;
  media_ids: string[];
}

export default class Twitter extends Twit {
  constructor(options: Twit.Options) {
    super(options);
  }

  public async postImage(imageBase64: string, statusText: string): Promise<void> {
    const uploadResponse: PromiseResponse = await this.post('media/upload', { media_data: imageBase64 });

    if (!uploadResponse)
      throw Error('Failed to upload image to Twitter.');

    // @ts-ignore # @Twit learn how 2 TS
    const mediaID: string = uploadResponse.data.media_id_string;

    const metaParams: IMetaParams = {
      media_id: mediaID,
      alt_text: {
        text: statusText
      },
    };

    const metaResponse: PromiseResponse = await this.post('media/metadata/create', metaParams);

    if (!metaResponse)
      throw Error('Failed to assign metadata to previous upload on Twitter.');

    const statusParams: IStatusParams = {
      status: statusText,
      media_ids: [mediaID],
    };

    const statusResponse: PromiseResponse = await this.post('statuses/update', statusParams);

    if (!statusResponse)
      throw Error('Failed to create Tweet.');
  }
}
