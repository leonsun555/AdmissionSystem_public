
module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: '北藝大-招生行政系統',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }
    ],
    script: [
      { src: 'https://kit.fontawesome.com/6fe0db6787.js' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/transition.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/notyfPlugin.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module'
    '@nuxtjs/moment'
  ],
  moment: {
    defaultLocale: 'zh-tw',
    locales: ['zh-tw','zh-cn']
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/bulma',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    '@nuxtjs/auth',
    'cookie-universal-nuxt',
  ],
  //sass mixin外掛
  styleResources: {
    scss: [
      '~/assets/mixin.scss',
    ]
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    credentials: true
  },
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, { isDev, isClient }) {

    }
  },
  server: {
    port: 3355
  },
  // serverMiddleware: ['~/api/fileManipulate'],
  // auth: {
  //   strategies: {
  //     local: {
  //       endpoints: {
  //         login: {
  //           url: 'http://10.36.3.30:5100/api/Auth/Authentication',
  //           method: 'post',
  //           propertyName: 'token'
  //         },
  //         logout: { 
  //           url: '/auth/logout', 
  //           method: 'post' 
  //         }
  //       },
  //       tokenRequired: true,
  //       tokenType: 'bearer'
  //     }
  //   },
  //   redirect: {
  //     login: '/',
  //     logout: '/',
  //   }
  // },
  // router: {
  //   middleware: ['authenticated']
  // },
  // { path: '/api/writeFile', handler: '~/api/writeFile.js' }, 
}
