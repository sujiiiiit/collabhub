import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from '@/lib/store';
import './styles/index.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster2 } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <App />
        <Toaster />
        <Toaster2 />
      </Router>
    </Provider>
  </StrictMode>
);