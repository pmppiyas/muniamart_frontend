export type NavItem = {
  title: string;
  href: string;
  iconName?: string;
};

export type RouteSection = {
  title: string;
  nav: NavItem[];
};

export const adminRoutes: RouteSection[] = [
  {
    title: 'Main Menu',
    nav: [
      {
        title: 'Overview',
        href: '/admin/dashboard',
        iconName: 'LayoutDashboard',
      },
      {
        title: 'Products',
        href: '/admin/dashboard/products',
        iconName: 'Package',
      },
      {
        title: 'Categories',
        href: '/admin/dashboard/categories',
        iconName: 'Tags',
      },
    ],
  },

  {
    title: 'User Management',
    nav: [
      {
        title: 'Customers',
        href: '/admin/dashboard/customers',
        iconName: 'Users',
      },
      {
        title: 'Admins',
        href: '/admin/dashboard/admins',
        iconName: 'ShieldCheck',
      },
    ],
  },

  {
    title: 'Sales & Finance',
    nav: [
      {
        title: 'Payments',
        href: '/admin/dashboard/payments',
        iconName: 'CreditCard',
      },
      {
        title: 'Transactions',
        href: '/admin/dashboard/transactions',
        iconName: 'ReceiptText',
      },
    ],
  },

  {
    title: 'Store Management',
    nav: [
      {
        title: 'Inventory',
        href: '/admin/dashboard/inventory',
        iconName: 'Boxes',
      },
      {
        title: 'Coupons',
        href: '/admin/dashboard/coupons',
        iconName: 'TicketPercent',
      },
      {
        title: 'Reviews',
        href: '/admin/dashboard/reviews',
        iconName: 'Star',
      },
    ],
  },

  {
    title: 'System',
    nav: [
      {
        title: 'Settings',
        href: '/admin/dashboard/settings',
        iconName: 'Settings',
      },
      {
        title: 'Profile',
        href: '/admin/dashboard/profile',
        iconName: 'UserCog',
      },
    ],
  },
];

export const getRoutesByRole = (role: string): RouteSection[] => {
  if (role === 'ADMIN' || 'SUPER_ADMIN') {
    return adminRoutes;
  }

  return [];
};
