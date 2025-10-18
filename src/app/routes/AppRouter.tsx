import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainPage } from '@features/podcasts/pages';
import { Header } from '@shared/components/Header';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
