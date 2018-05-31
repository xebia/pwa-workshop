# Progressive Web App Workshop
This is example app for enriching with PWA technology creating for the PWA Workship during 
[Amsterdam JSNation Conference 2018](https://amsterdamjs.com/)

## Requirements
* Node with npm installed
* Your favorite editor/IDE capable of working with JS code
* Chrome browser
* A smartphone (IPhone users have to add to homescreen manually)

## Getting started
Please follow these steps to get the example app running on your machine.

```bash
git clone https://github.com/xebia/pwa-workshop.git
cd pwa-workshop
npm install
npm start
```
Open up chrome at http://localhost:8080

Then in new console run
```bash
npm run expose
```

This starts a tunnel with `https` to make it easy to open the app on your mobile phone. Open your phones browser at 
https://{some-hash}.ngrok.io

If you see the static (non-progressive) website on your phone, you are ready to start the workshop! :D

## Overview
Running `npm start` serves the current directory. There is no build step.

Running `npm run start:random` starts the same server, but serves random news. This is useful for demonstrating news is
updated in the background in `Bonus Step 4`.

The `solutions/` directory contains the answers for the exercises. Use this if you did not finish the exercise in 
time.

`index.html` is a bootstrap.css based responsive webpage

`server.js` serves the current directory and proxies all other calls to an 
[unofficial hacker news API](https://github.com/cheeaun/node-hnapi). The browser caching of this API is disabled to 
make it useful to cache with a service worker.

`main.js` makes a call to `/news` and puts this on the page using a simple `.innerHTML` call.

The `instructor-scripts/` directory contains scripts making it easier to update all steps. This is only needed for 
instructors developing this workshop.

## Lighthouse
1. Open Developer Tools and go to the `Audit` tab.
2. Press `Perform an audit...` and press Run audit. For this workshop you only need to run the PWA tests.

## Step 1: Adding app icons and manifest

We want to add icons and a splashscreen to our app. A generator can automatically create the required resources and 
provide the required code.

1. Go to the online [favicon generator](https://realfavicongenerator.net/) and generate an icon bundle. Use the 
provided icon `icon.png`.
2. Extract the generated files in the project folder.
3. Add the generated html snippet to the head of `index.html`.
4. Set the `name`, `short_name` and `start_url` (`= "/"`) properties in `site.webmanifest`.
5. Verify the fields in the manifest section of the `application` tab in the chrome devtools. Note the 
`add to homescreen` link doesn't work yet.
6. Run a lighthouse check and verify there are no manifest related errors.
7. Check out the user experience of adding the app on the homescreen of your phone, by choosing "Add to Home screen" 
from the browser's menu. There will not be an `app install banner` yet, but you can add the app manually to your 
homescreen.
8. Remove the app from your homescreen again.

## Step 2: Using workbox to precache files
We're going to use the workbox-cli to generate a service worker which will precache all requied static resources on 
installation. workbox-cli will automatically put hashes of the files in the service worker file.
1. Add this code to the end of the `<main>` section of `index.html`.
    ```html
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
3. Run `npm i -D workbox-cli` to add workbox command line tools to your `devDependencies`.
4. Run `./node_modules/.bin/workbox wizard --injectManifest`. And manually choose `.` as the root of your web app.
Let the wizard cache all files, by pressing `return` (`space` allows you to unselect and select file types), and let it 
use `sw-src.js` as a source of your service worker to generate `sw.js`.
5. Add a npm script called `generate-sw` to your `package.json` which runs `workbox injectManifest`.
6. Run `npm run generate-sw`.
7. Check out the chrome devtools console to see the workbox debug output. Also see the service worker installed in the 
`service worker` section of the `application` tab in the devtools.
8. Run lighthouse on your ngrok https url and verify you score 100 points for progressive web app! (At the time of 
writing it falsely says no redirect is done to https, see GoogleChrome/lighthouse#2383)
9. Make a change to `index.html`. See how it is not being picked up by refreshing. Run `npm run generate-sw` again and
  refresh the page. The change is still not picked up, but the new service worker is shown as `waiting to activate` in
the `application` -> `service worker` devtools section. Close all tabs of the app and re-open them to start using the
new service worker. This is how users update to the new version of the service worker.
10. Make a change to `index.html` again and run `generate-sw` again. Now update the service worker by using the 
`skip waiting` link in the service worker devtools section or by clicking the `Update on reload` checkbox. Refresh the 
page to see the change. This is how to update the service worker while developing.

**Important note: Run `npm run generate-sw` every time you make a change to a cached resource. Otherwise changes are not 
being picked up anymore, not even after a hard refresh. It's also a good idea to manually unregister the service worker 
after you have finished this workshop. Making changes with service workers take some time getting used to.**


## Step 3: Add runtime caching to API calls
Although the app is installable and will load while offline it won't show news while offline. Instead it will show 
`Network error while loading news`. Browser caching would work for this use case, but we want control over the cache on 
the client. For example we want to be able to use a `stale while revalidate` caching strategy in the next exercise.
Therefore we are going to leverage runtime caching in our workbox serviceworker.

1. Add this code to `sw.js`
    ```js
    workbox.routing.registerRoute(
      '/news',
      workbox.strategies.networkFirst()
    );
    ```
2. Regenerate the service worker with `generate-sw`
3. Check the chrome devtools console to verify that workbox is responding to `/news`.
4. Check the chrome devtools network tab to verify `/news` is fetched by the service worker.
5. Open the cache section of the `application` tab of the chrome devtools. Find the `precache` and the `runtime` cache.
Find the news data in the runtime cache.
6. Try loading the web app while offline, by ticking the `Offline` box under `Application` -> `Service Workers`. It 
should show the previously fetched news!


## Bonus Step 4: Stale while revalidate for slow networks
If you completed the previous exercises your app works great while offline and online. However, when your network is 
slow the screen will remain empty while the news is loading. This can be solved by displaying the cached version before 
the network call is completed. The service worker will still do the network call in the background. When a server 
response is returned it will be cached and workbox will broadcast a message notifying the app that the news was updated.
The app can now refresh the news page by retrieving it from the cache.

1. Kill (`ctrl+c`) the server and start a different server using `npm run start:random`. This ensures that workbox 
always has a cache update to broadcast. Otherwise not all of your code will run.
2. Use the `staleWhileRevalidate` caching strategy together with the `broadcastUpdate` plugin. Read 
[this guide](https://developers.google.com/web/tools/workbox/modules/workbox-broadcast-cache-update) which explains how
to do this. You need to update `main.js` to update the view when the cache was updated.
3. Note that the user experience suffers when the entire list of news is suddenly replaced. Make it possible for the
user to chose whether to update or not by adding a "update news" button. The button should only be displayed when the
cache was updated.

## Bonus Step 5: Improve performance
We only have a couple lines of code in our application, however we're not getting a 100 points on the performance audit
of lighthouse. Extract the critical CSS from bootstrap.css and inline it in the html to improve the performance. See if 
you can get 100 points.
