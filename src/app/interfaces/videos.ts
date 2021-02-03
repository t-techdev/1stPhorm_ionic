export interface Video {
  id: number;
  total_views: number;
  description: string;
  live_status: string;
  duration: string;
  length: number;
  created_at: string;
  publish_date?: string;
  poster: string;
  thumbnail: string;
  signed_url: string;
  title: string;
}

export interface Videos {
    videos?: Video[];
    active_stream?: Video;
}

export interface FeedItem {
  id: number;
  text: string;
  author: string;
  special: boolean;
  sticky: boolean;
  approved_at: string;
  created_at: string;
  updated_at: string;
}

export type UrlHandlerCallback = (url: string) => void;
