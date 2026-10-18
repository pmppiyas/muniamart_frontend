import { env } from './env';

export const siteConfig = {
  name: 'MUNIAMART',
  tagline: 'Your Trusted Modern E-Commerce Destination',
  description:
    'Discover premium quality products at the best prices with lightning fast delivery, easy returns, and secure payment options.',
  url: env.SITE_URL,
  contact: {
    phone: '+880 1700-000000',
    email: 'support@muniamart.com',
    address: 'Level 5, Innovation Tower, Dhaka, Bangladesh',
    hours: '24/7 Customer Support',
  },
  announcement: {
    enabled: true,
    text: '⚡ Spring Flash Sale: Up to 50% OFF on Top Electronics & Free Shipping over $50!',
    link: '/products?sale=true',
  },
  socialLinks: [
    { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
    { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
    { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { name: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
  ],
  navItems: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'Deals', href: '/products?deal=true', badge: 'Hot' },
    { label: 'New Arrivals', href: '/products?sort=newest', badge: 'New' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  categories: [
    {
      id: 'phones-tablets',
      name: 'Phones & Tablets',
      slug: 'phones-tablets',
      icon: 'Smartphone',
      subcategories: ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'Xiaomi & OnePlus', 'iPad & Tablets'],
    },
    {
      id: 'laptops-computers',
      name: 'Laptops & Computers',
      slug: 'laptops-computers',
      icon: 'Laptop',
      subcategories: ['MacBook', 'Windows Laptops', 'Gaming Laptops', 'Desktop & Mac', 'Monitors'],
    },
    {
      id: 'smart-watch-wearables',
      name: 'Smart Watch & Wearables',
      slug: 'smart-watch-wearables',
      icon: 'Watch',
      subcategories: ['Apple Watch', 'Samsung Galaxy Watch', 'Fitness Bands', 'Watch Accessories'],
    },
    {
      id: 'audio-sound',
      name: 'Audio & Sound',
      slug: 'audio-sound',
      icon: 'Headphones',
      subcategories: ['AirPods', 'Wireless Earbuds', 'Over-Ear Headphones', 'Bluetooth Speakers'],
    },
    {
      id: 'cameras-drones',
      name: 'Cameras & Drones',
      slug: 'cameras-drones',
      icon: 'Camera',
      subcategories: ['Action Cameras', 'Drones', 'Gimbals & Stabilizers', 'Camera Accessories'],
    },
    {
      id: 'power-accessories',
      name: 'Power & Accessories',
      slug: 'power-accessories',
      icon: 'Zap',
      subcategories: ['Chargers & Adapters', 'Power Banks', 'Cables & Hubs', 'Cases & Protection'],
    },
  ],
  footerLinks: {
    shop: [
      { label: 'All Products', href: '/products' },
      { label: 'Special Offers', href: '/products?deal=true' },
      { label: 'Top Rated', href: '/products?sort=rating' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Trending Items', href: '/products?trending=true' },
    ],
    customerService: [
      { label: 'Help Center & FAQ', href: '/faq' },
      { label: 'Track Order', href: '/orders' },
      { label: 'Shipping & Delivery', href: '/shipping' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Payment Methods', href: '/payment-methods' },
    ],
    company: [
      { label: 'About MUNIAMART', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Affiliate Program', href: '/affiliate' },
    ],
  },
};
