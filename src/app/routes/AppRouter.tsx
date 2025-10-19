import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainPage } from '@features/podcasts/pages';
import { PodcastDetailPage } from '@features/podcast-detail/pages';
import { EpisodePlayerPage } from '@features/episode-player/pages';
import { Header } from '@shared/components/Header';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/podcast/:podcastId" element={<PodcastDetailPage />} />
        <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodePlayerPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
