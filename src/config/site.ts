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
      id: 'electronics',
      name: 'Electronics & Gadgets',
      slug: 'electronics',
      icon: 'Smartphone',
      subcategories: ['Smartphones', 'Laptops & Computers', 'Smart Watches', 'Audio & Headphones', 'Cameras'],
    },
    {
      id: 'fashion',
      name: 'Fashion & Apparel',
      slug: 'fashion',
      icon: 'Shirt',
      subcategories: ["Men's Wear", "Women's Wear", 'Footwear', 'Accessories', 'Watches'],
    },
    {
      id: 'home-kitchen',
      name: 'Home & Living',
      slug: 'home-living',
      icon: 'Home',
      subcategories: ['Kitchen Appliances', 'Home Decor', 'Bedding', 'Furniture', 'Lighting'],
    },
    {
      id: 'beauty-health',
      name: 'Beauty & Personal Care',
      slug: 'beauty-health',
      icon: 'Sparkles',
      subcategories: ['Skincare', 'Haircare', 'Fragrances', 'Personal Hygiene', 'Makeup'],
    },
    {
      id: 'sports-outdoors',
      name: 'Sports & Fitness',
      slug: 'sports-fitness',
      icon: 'Dumbbell',
      subcategories: ['Gym Equipment', 'Sportswear', 'Outdoor Gear', 'Cycling', 'Camping'],
    },
    {
      id: 'groceries',
      name: 'Daily Groceries',
      slug: 'groceries',
      icon: 'ShoppingBasket',
      subcategories: ['Organic Foods', 'Beverages', 'Snacks', 'Pantry Staples', 'Household Essentials'],
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
