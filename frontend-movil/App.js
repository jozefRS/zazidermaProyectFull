import { AuthProvider } from './src/context/AuthContext';
import Navigation from './src/components/Navigation';
import { CatalogProvider } from './src/context/CatalogContext';
import { SalesProvider } from './src/context/SalesContext';

export default function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <SalesProvider>
        <Navigation />
        </SalesProvider>      
      </CatalogProvider>
    </AuthProvider>
  );
}
