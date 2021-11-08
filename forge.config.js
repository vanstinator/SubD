const config = {
  packagerConfig: {
    asar: true,
    prune: true,
    darwinDarkModeSupport: 'true',
    name: 'Sub Dazzle',
    executableName: 'SubDazzle',
    extendInfo: {
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: false,
        NSExceptionDomains: {
          'downloads.subdazzle.com': {
            NSTemporaryExceptionAllowsInsecureHTTPSLoads: true,
            NSIncludesSubdomains: true,
            NSTemporaryExceptionAllowsInsecureHTTPLoads: true,
            NSTemporaryExceptionMinimumTLSVersion: '1.0',
            NSTemporaryExceptionRequiresForwardSecrecy: false
          }
        }
      }
    }
  },
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack/main.webpack.js',
        renderer: {
          config: './webpack/renderer.webpack.js',
          entryPoints: [
            {
              html: './public/index.html',
              js: './src/index.tsx',
              name: 'main_window',
              preload: {
                js: './core/preload.ts'
              }
            }
          ]
        }
      }
    ]
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'sub_dazzle'
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ]
};

if (process.env.CI) {
  config.packagerConfig = {
    ...config.packagerConfig,
    osxSign: {
      entitlements: './bin/entitlements.plist',
      'entitlements-inherit': './bin/entitlements.plist',
      'gatekeeper-assess': false,
      hardenedRuntime: true,
      identity: 'Developer ID Application: Justin Vanderhooft (2RSKA7RG4C)'
    },
    osxNotarize: {
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD
    }
  };
}

module.exports = config;
