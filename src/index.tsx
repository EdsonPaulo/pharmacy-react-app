import '@fontsource/roboto-slab';
import '@fontsource/roboto';
import '@fontsource/poppins';
import 'nprogress/nprogress.css';

import NProgress from 'nprogress';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import customTheme from './styles/custom-theme';
import './styles/globals.scss';
import { Router } from './routes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/useAuth';

NProgress.configure({ showSpinner: true });

const container = document.getElementById('root');
if (container == null) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ColorModeScript />
          <AuthProvider>
            <Router />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
reportWebVitals();
