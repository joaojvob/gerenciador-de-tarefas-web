import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}

export default AppProviders;