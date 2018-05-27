# Progressive Web App Workshop
This is example app for enriching with PWA technology creating for the PWA Workship during 
[Amsterdam JSNation Conference 2018](https://amsterdamjs.com/)

## Requirements
* node with npm installed
* your favorite editor/IDE capable of working with JS code
* Chrome browser

## Getting started
Please follow these steps to get the example app running on your machine.

```bash
git clone https://github.com/xebia/pwa-workshop.git
cd pwa-workshop
npm install
npm start
```
Open up chrome at http://localhost:8080

```bash
npm run expose
```

Starts a tunnel with `https` to make it easy to open the app on your mobile phone. Open your phones browser at https://{some-hash}.ngrok.io


## Overview
Running `npm start` serves the current directory. There is no build step.

The `solutions/` directory contains the answers for the exercises. Use this if you didn't finish the exercise in time.

`index.html` bootstrap.css based responsive webpage

`server.js` serves the current directory and proxy all other calls to an [unofficial hacker news API](https://github.com/cheeaun/node-hnapi). The browser caching of this API is disabled to make it useful to cache with a service worker.

`main.js` makes a call to `/news` and puts this on the page using a simple `.innerHTML` call.

The `instructor-scripts/` directory contains scripts making it easier to update all steps. This is only needed for instructors developing this workshop.

## Lighthouse
1. Open Developer Tools and go to the `Audit` tab.
2. Press `Perform an audit...` and press Run audit.

## Step 1: Adding app icons and manifest

We want to add icons and a splashscreen to our app. A generator can automatically create the required resources and provide the required code.

1. Go to the online [favicon generator](https://realfavicongenerator.net/) and generate an icon bundle.
2. Extract the generated files in the project folder.
3. Add the generated html snippet to the head of `index.html`.
4. Set the `name`, `short_name` and `start_url` properties in `site.webmanifest`.

## Step 2: Using workbox to precache files

## Step 3: Add runtime caching to API calls

## Bonus Step 4: Stale while revalidate for slow networks
If you completed the previous exercises your app works great while offline and online. However, when your network is slow the screen will remain empty while the news is loading. This can be solved by displaying the cached version before the network call is completed. The servicer worker will still do the network call in the background. When a server response is returned we will broadcast a message notifying the app that the news was updated. The app can now refresh the news page.