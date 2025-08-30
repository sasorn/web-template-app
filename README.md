# This is a Base app

This app creates a /bundle.js app only.

## Structure

```
web-template-app/
├── config/
│   ├── jest/
│   │   ├── babelTransform.js
│   │   ├── cssTransform.js
│   │   └── fileTransform.js
│   ├── webpack/
│   │   ├── persistentCache/
│   │   │   └── createEnvironmentHash.js
│   │   ├── env.js
│   │   ├── getHttpConfig.js
│   │   ├── paths.js
│   │   ├── webpack.config.js
│   │   └── webpackDevServer.config.js
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── utils/
├── public/
│   ├── index.html
│   └── assets/
├── .env
├── .gitignore
├── package.json
├── README.md
├── webpack.config.js
└── tsconfig.json
```

```
# install dependencies
yarn

# start app
yarn start

# test
yarn test

# build app
yarn build
```

## html:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Website</title>
    <!-- Add any other meta tags, link tags for fonts, etc. here -->
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>

    <!-- This is the root element where your React app will mount -->
    <div id="ts-base-app"></div>

    <!-- This script tag loads your entire React application -->
    <script crossorigin src="https://localhost:3200/bundle.js"></script>
  </body>
</html>
```
