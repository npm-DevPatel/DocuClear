import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { ResultsPage } from './pages/ResultsPage';
import { ChatPage } from './pages/ChatPage';
import { HistoryPage } from './pages/HistoryPage';
import { AuthPage } from './pages/AuthPage';
import { ROUTES } from './utils/constants';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: ROUTES.UPLOAD, element: <UploadPage /> },
      { path: ROUTES.PROCESSING, element: <ProcessingPage /> },
      { path: ROUTES.RESULTS, element: <ResultsPage /> },
      { path: ROUTES.CHAT, element: <ChatPage /> },
      { path: ROUTES.HISTORY, element: <HistoryPage /> },
      { path: ROUTES.AUTH, element: <AuthPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
