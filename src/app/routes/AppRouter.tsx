import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Header } from '@shared/components/Header';
import { LoadingIndicator } from '@shared/components/LoadingIndicator';

const MainPage = lazy(() =>
  import('@features/podcasts/pages').then((module) => ({ default: module.MainPage })),
);
const PodcastDetailPage = lazy(() =>
  import('@features/podcast-detail/pages').then((module) => ({
    default: module.PodcastDetailPage,
  })),
);
const EpisodePlayerPage = lazy(() =>
  import('@features/episode-player/pages').then((module) => ({
    default: module.EpisodePlayerPage,
  })),
);

export function AppRouter() {
  return (
    <BrowserRouter basename="/podcast-app">
      <Header />
      <Suspense fallback={<LoadingIndicator />}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/podcast/:podcastId" element={<PodcastDetailPage />} />
          <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodePlayerPage />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
