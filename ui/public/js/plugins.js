window.plugins = [
  {
    name: "bookings",
    port: 3002,
    exposes: {
      "./routes": "./src/routes.tsx",
      "./settings": "./src/Settings.tsx",
    },
    routes: {
      url: "http://localhost:3002/remoteEntry.js",
      scope: "bookings",
      module: "./routes",
    },
    menus: [
      {
        text: "Bookings",
        url: "/bookings",
        icon: "icon-paste",
        location: "mainNavigation",
      },
      {
        text: "Bookings settings",
        icon: "icon-paste",
        location: "settings",
        scope: "bookings",
        component: "./settings",
      },
    ],
  },
  {
    name: "cards",
    port: 3003,
    exposes: {
      "./routes": "./src/routes.tsx",
      "./settings": "./src/Settings.tsx",
    },
    routes: {
      url: "http://localhost:3003/remoteEntry.js",
      scope: "cards",
      module: "./routes",
    },
    menus: [
      {
        text: "Sales Pipeline1",
        url: "/deal",
        icon: "icon-megaphone",
        location: "mainNavigation",
      },
      {
        text: "Campaigns settings",
        icon: "icon-megaphone",
        location: "settings",
        scope: "cards",
        component: "./settings",
      },
    ],
  },
  {
    name: "engages",
    port: 3001,
    exposes: {
      "./routes": "./src/routes.tsx",
      "./settings": "./src/Settings.tsx",
    },
    routes: {
      url: "http://localhost:3001/remoteEntry.js",
      scope: "engages",
      module: "./routes",
    },
    menus: [
      {
        text: "Campaigns",
        url: "/campaigns",
        icon: "icon-megaphone",
        location: "mainNavigation",
      },
      {
        text: "Campaigns settings",
        icon: "icon-megaphone",
        location: "settings",
        scope: "engages",
        component: "./settings",
      },
    ],
  },
  {
    name: "knowledgeBase",
    port: 3004,
    exposes: {
      "./routes": "./src/routes.tsx",
      "./settings": "./src/Settings.tsx",
    },
    routes: {
      url: "http://localhost:3004/remoteEntry.js",
      scope: "knowledgeBase",
      module: "./routes",
    },
    menus: [
      {
        text: "Knowledge Base",
        url: "/knowledgeBase",
        icon: "icon-book-open",
        location: "mainNavigation",
      },
    ],
  },
];
