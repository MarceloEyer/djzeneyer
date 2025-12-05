import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ChallengePage } from './pages/ChallengePage';
import './index.css';

// Placeholder pages
const LevelsPage = () => <div className="card">Níveis - Em desenvolvimento</div>;
const JournalPage = () => <div className="card">Journal - Em desenvolvimento</div>;
const BadgesPage = () => <div className="card">Badges - Em desenvolvimento</div>;
const ConfigPage = () => <div className="card">Configurações - Em desenvolvimento</div>;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="desafio" element={<ChallengePage />} />
          <Route path="niveis" element={<LevelsPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="badges" element={<BadgesPage />} />
          <Route path="config" element={<ConfigPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
