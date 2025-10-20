import { LoadingProvider } from '@app/providers';
import { AppRouter } from '@app/routes';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <AppRouter />
      </LoadingProvider>
    </ErrorBoundary>
  );
}

export default App;
