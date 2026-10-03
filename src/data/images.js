import { API_BASE } from '../services/api.js';
import aloo from '../assets/images/aloo-sadeko.jpg';
import butterTea from '../assets/images/butter-tea.jpg';
import cafeGuests from '../assets/images/cafe-guests.jpg';
import cappuccino from '../assets/images/cappuccino.jpg';
import chatamari from '../assets/images/chatamari.jpg';
import sekuwa from '../assets/images/chicken-sekuwa.jpg';
import chowmein from '../assets/images/chowmein.jpg';
import evening from '../assets/images/evening-lighting.jpg';
import hero from '../assets/images/hero-kathmandu-cafe.jpg';
import latte from '../assets/images/himalayan-latte.jpg';
import iced from '../assets/images/iced-coffee.jpg';
import jhol from '../assets/images/jhol-momo.jpg';
import kathmandu from '../assets/images/kathmandu-evening.jpg';
import kheer from '../assets/images/kheer.jpg';
import latteArt from '../assets/images/latte-art.jpg';
import chiya from '../assets/images/masala-chiya.jpg';
import interior from '../assets/images/mithaas-interior.jpg';
import momo from '../assets/images/momo.jpg';
import coffee from '../assets/images/nepali-coffee.jpg';
import mocha from '../assets/images/nepali-mocha.jpg';
import pottery from '../assets/images/nepali-pottery.jpg';
import khaja from '../assets/images/newari-khaja.jpg';
import selRoti from '../assets/images/sel-roti.jpg';
import kitchen from '../assets/images/signature-kitchen.jpg';
import platter from '../assets/images/signature-platter.jpg';
import thakali from '../assets/images/thakali-set.jpg';
import yomari from '../assets/images/yomari.jpg';

export const images = {
  'aloo-sadeko.jpg': aloo,
  'butter-tea.jpg': butterTea,
  'cafe-guests.jpg': cafeGuests,
  'cappuccino.jpg': cappuccino,
  'chatamari.jpg': chatamari,
  'chicken-sekuwa.jpg': sekuwa,
  'chowmein.jpg': chowmein,
  'evening-lighting.jpg': evening,
  'hero-kathmandu-cafe.jpg': hero,
  'himalayan-latte.jpg': latte,
  'iced-coffee.jpg': iced,
  'jhol-momo.jpg': jhol,
  'kathmandu-evening.jpg': kathmandu,
  'kheer.jpg': kheer,
  'latte-art.jpg': latteArt,
  'masala-chiya.jpg': chiya,
  'mithaas-interior.jpg': interior,
  'momo.jpg': momo,
  'nepali-coffee.jpg': coffee,
  'nepali-mocha.jpg': mocha,
  'nepali-pottery.jpg': pottery,
  'newari-khaja.jpg': khaja,
  'sel-roti.jpg': selRoti,
  'signature-kitchen.jpg': kitchen,
  'signature-platter.jpg': platter,
  'thakali-set.jpg': thakali,
  'yomari.jpg': yomari,
};

export const libraryImages = Object.keys(images);

export function resolveImage(key) {
  if (!key) return '';
  if (key.startsWith('/uploads/')) return `${API_BASE}${key}`;
  if (key.startsWith('/') || key.startsWith('http') || key.startsWith('blob:')) return key;
  return images[key] || '';
}
