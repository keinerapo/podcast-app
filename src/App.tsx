import { LoadingProvider } from '@app/providers';
import { AppRouter } from '@app/routes';
import './App.css';

function App() {
  return (
    <LoadingProvider>
      <AppRouter />
    </LoadingProvider>
  );
}

export default App;
