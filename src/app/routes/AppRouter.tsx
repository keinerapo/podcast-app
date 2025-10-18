import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from '@shared/components/Header';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<div>Main Page</div>} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
