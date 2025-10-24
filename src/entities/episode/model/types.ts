export interface Episode {
  id: string;
  title: string;
  description: string;
  publishedDate: string;
  duration: number;
  audioUrl: string;
  episodeUrl?: string;
}
