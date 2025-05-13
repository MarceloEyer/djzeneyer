import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import MusicPage from './pages/MusicPage';
import ZenTribePage from './pages/ZenTribePage';
import NotFoundPage from './pages/NotFoundPage';

// Context Providers
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <MusicPlayerProvider>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="music" element={<MusicPage />} />
              <Route path="tribe" element={<ZenTribePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </MusicPlayerProvider>
    </UserProvider>
  );
}

export default App;