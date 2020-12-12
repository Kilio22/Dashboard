import { Thumbnail } from './thumbnail';

interface YtChannelSwagStats {
    viewCount: number;
    subscriberCount: number;
    videoCount: number;
}

export interface YtChannel {
    title: string;
    description: string;
    thumbnail: Thumbnail;
    country: string;
    statistics: YtChannelSwagStats;
}
