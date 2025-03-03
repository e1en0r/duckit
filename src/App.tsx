import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthenticationProvider } from 'context/AuthenticationProvider';
import { Layout } from './Layout';
import '@phork/phorkit/styles/common.css';
import '@phork/phorkit/styles/fonts.css';
import '@phork/phorkit/styles/normalize.css';
import 'styles/fonts/LuloCleanOneBold/main.css';
import './App.css';

const DuckGrid = lazy(() => import('pages/DuckGrid'));
const FourOhFour = lazy(() => import('pages/FourOhFour'));

const queryClient = new QueryClient();

export const App = (): React.ReactElement => (
  <QueryClientProvider client={queryClient}>
    <AuthenticationProvider>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <Layout>
                <Outlet />
              </Layout>
            }
            path="/"
          >
            <Route index element={<DuckGrid />} />
            <Route element={<FourOhFour />} path="*" />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthenticationProvider>
  </QueryClientProvider>
);

App.displayName = 'App';
