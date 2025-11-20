// src/pages/EventsPage.tsx - VERSÃO FINAL (COM BANDSINTOWN REAL INTEGRADO)

import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO'; 
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Ticket, 
  Music2, 
  Star, 
  GlassWater, 
  Heart, 
  Percent,
  Plus,
  Globe
} from 'lucide-react';

// ============================================================================
// DADOS ESTRATÉGICOS (MOCKUP PARA WOOCOMMERCE E AUTORIDADE)
// ============================================================================

/**
 * Eventos Próprios (WooCommerce) - Destaque Ouro (Venda Direta)
 */
const WOO_EVENTS = [
  {
    id: 'woo-1',
    title: 'Mentoria DJ Zen Eyer: Turma X',
    date: '2025-11-20',
    time: '19:00',
    location: 'Online (Zoom)',
    type: 'Mentoria',
    image: 'https://placehold.co/600x400/0D96FF/FFFFFF?text=Mentoria+DJ&font=orbitron',
    price