# location-app

> A Vue.js project that is create by using Google Maps API and is a simple web application to acquire locations and show local time by location time zone.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Config

> Please register your Google API Key and TimeZoneDB API Key before local run this repo. For TimeZoneDB, please visit https://timezonedb.com/account to create a account for free and get an API Key. For Google API Key, please visit https://cloud.google.com/.

**Set Up**
1. Open index.html file, on line 7 and 8, replace your API Keys in YOUR_TIMEZONEDB_API_KEY and YOUR_GOOGLE_API_KEY.

```
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_TIMEZONEDB_API_KEY: '"YOUR_TIMEZONEDB_API_KEY"', // insert your YOUR_TIMEZONEDB_API_KEY here
  VUE_APP_GOOGLE_MAP_API_KEY: '"YOUR_GOOGLE_API_KEY"', // insert your YOUR_GOOGLE_API_KEY here
})

```

2. Open config/dev.env.js, on line 12, replace your API Key in YOUR_GOOGLE_API_KEY.

```

    <!-- Add your google api key here, replace YOUR_GOOGLE_API_KEY -->
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places"></script>

```
