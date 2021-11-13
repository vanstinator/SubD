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
      },
      ['@electron-forge/plugin-auto-unpack-natives']
    ]
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'sub-dazzle'
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

  config.makers.find(maker => maker.name === '@electron-forge/maker-squirrel').config = {
    exe: 'SubDazzle.exe',
    // TODO enable this line after we cut a first release. Update server responds with errors otherwise
    remoteReleases: process.env.CI ? `https://downloads.subdazzle.com/update/win32/0.0.0` : undefined,
    signWithParams: `/f ${process.env['WINDOWS_PFX_FILE']} /p ${process.env['CERTIFICATE_PASSWORD']} /tr http://timestamp.comodoca.com /td sha256`
  };
}

module.exports = config;
