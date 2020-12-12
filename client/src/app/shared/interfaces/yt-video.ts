import { Thumbnail } from './thumbnail';

interface YtVideoSwagStats {
    viewCount: number;
    likeCount: number;
    dislikeCount: number;
    commentCount: number;
    favoriteCount: number;
}

export interface YtVideo {
    title: string;
    description: string;
    thumbnail: Thumbnail;
    channelTitle: string;
    statistics: YtVideoSwagStats;
}
