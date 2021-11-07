module.exports = {
  packagerConfig: {
    asar: true,
    ignore:
      '\\.git(ignore|modules)|node_modules/(\\.cache|.cli-ngcc)|\\.vscode|e2e|\\.editorconfig|\\.eslintrc\\.json|\\.npmrc|angular\\.json|angular\\.webpack\\.js|main\\.js\\.map|main\\.ts|tsconfig\\.json|tsconfig\\.serve\\.json|\\.env',
    darwinDarkModeSupport: 'true',
    name: 'Sub Dazzle',
    executableName: 'SubDazzle',
    osxSign: {
      entitlements: './bin/entitlements.plist',
      'entitlements-inherit': './bin/entitlements.plist',
      'gatekeeper-assess': false,
      hardenedRuntime: true,
      identity: 'Developer ID Application: Justin Vanderhooft (2RSKA7RG4C)',
      'signature-flags': 'library'
    },
    osxNotarize: {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: '2RSKA7RG4C'
    },
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
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ]
};
