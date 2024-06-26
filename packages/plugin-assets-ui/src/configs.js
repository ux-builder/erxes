module.exports = {
  srcDir: __dirname,
  name: "assets",
  port: 3212,
  scope: "assets",
  exposes: {
    "./routes": "./src/routes.tsx",
    "./selectWithAsset": "./src/common/SelectWithAssets.tsx",
  },
  routes: {
    url: "http://localhost:3212/remoteEntry.js",
    scope: "assets",
    module: "./routes",
  },
  formsExtraFields: [
    {
      scope: "assets",
      component: "./selectWithAsset",
      type: "asset",
    },
  ],
  menus: [
    {
      text: "Assets",
      to: "/settings/assets/",
      image: "/images/icons/erxes-18.svg",
      location: "settings",
      scope: "assets",
      action: "assetsAll",
      permissions: ["showAssets", "manageAssets"],
    },
    {
      text: "Asset & Movements",
      url: "/asset-movements",
      icon: "icon-piggybank",
      location: "mainNavigation",
      action: "assetsAll",
      permissions: ["showAssets", "manageAssets"],
    },
  ],
};
