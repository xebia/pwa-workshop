# Progressive Web App Workshop
This is example app for enriching with PWA technology creating for the PWA Workship during 
[Amsterdam JSNation Conference 2018](https://amsterdamjs.com/)

## Requirements
* Node with npm installed
* Your favorite editor/IDE capable of working with JS code
* Chrome browser
* A smartphone (To get an app install banner you need an Android phone)

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
2. Press `Perform an audit...` and press Run audit. For this workshop you only need to run the PWA tests.

## Step 1: Adding app icons and manifest

We want to add icons and a splashscreen to our app. A generator can automatically create the required resources and provide the required code.

1. Go to the online [favicon generator](https://realfavicongenerator.net/) and generate an icon bundle.
2. Extract the generated files in the project folder.
3. Add the generated html snippet to the head of `index.html`.
4. Set the `name`, `short_name` and `start_url` properties in `site.webmanifest`.
5. Verify the fields in the manifest section of the `application` tab in the chrome devtools. Note the `add to homescreen` link doesn't work yet.
6. Run a lighthouse check and verify there are no manifest related errors.
7. Check out the user experience of adding the app on the homescreen of your phone. There will not be an `app install banner` yet, but you can add the app manually to your homescreen.
8. Remove the app from your homescreen again.

## Step 2: Using workbox to precache files
We're going to use the workbox-cli to generate a service worker which will precache all requied static resources on installation. workbox-cli will automatically put hashes of the files in the service worker file.
1. Add this code to `index.html`.
    ```js
    <script>
      // Check that service workers are registered
      if ('serviceWorker' in navigator) {
        // Use the window load event to keep the page load performant
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js');
        });
      }
    </script>
    ```
2. Create a file called sw-src.js with these contents:
    ```js
    importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

    workbox.precaching.precacheAndRoute([]);
    ```
3. Run `npm i -D workbox-cli`.
4. Run `./node_modules/.bin/workbox-cli wizard --injectManifest`. Let the wizard cache all files and let it use `sw-src.js` as a source to generate `sw.js`.
5. Add a npm script called `generate-sw` which runs `workbox-cli injectManifest`.
6. Run `npm run generate-sw`.
7. Check out the chrome devtools console to see the workbox debug output. Also see the service werker installed in the `service worker` section of the `application` tab in the devtools.
8. Run lighthouse on your ngrok https url and verify you score 100 points for progressive web app!
9. Make a change to `index.html`. See how it is not being picked up by refreshing. Run `npm run generate-sw` again and generate refresh. The change is still not picked up, but the new service worker is shown as `waiting to activate` in the `service worker` devtools section. Close all tabs of the app and re-open them to start using the new service worker. This is how users update to the new version of the service worker.
10. Make a change to `index.html` again and run `generate-sw` again. Now update the service worker by using the `skip waiting` link in the service worker devtools section or by clicking the `Update on reload` checkbox. Refresh the page to see the change. This is how to update the service worker while developing.

**Important note: Run `npm run generate-sw` every time you make a change to a cached resource. Otherwise changes are not being picked up anymore, not even after a hard refresh. It's also a good idea to manually unregister the service worker after you have finished this workshop. Making changes with service workers take some time getting used to.**


## Step 3: Add runtime caching to API calls

## Bonus Step 4: Stale while revalidate for slow networks
If you completed the previous exercises your app works great while offline and online. However, when your network is slow the screen will remain empty while the news is loading. This can be solved by displaying the cached version before the network call is completed. The servicer worker will still do the network call in the background. When a server response is returned we will broadcast a message notifying the app that the news was updated. The app can now refresh the news page.