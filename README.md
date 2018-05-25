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
* open up chrome at http://localhost:8080

## Lighthouse
1. Open Developer Tools and go to the `Audit` tab.
2. Press `Perform an audit...` and press Run audit.

## Adding app icons and manifest

We want to add icons and a splashscreen to our app. A generator can automatically create the required resources and provide the required code.

1. Go to the online [favicon generator](https://realfavicongenerator.net/) and generate an icon bundle.
2. Extract the generated files in the project folder.
3. Add the generated html snippet to the head of `index.html`.
4. Set the `name`, `short_name` and `start_url` properties in `site.webmanifest`.

## Using workbox to precache files

## Add runtime caching to API calls

## Bonus: Stale while revalidate for slow networks
If you completed the previous exercises your app works great while offline and online. However, when your network is slow the screen will remain empty while the news is loading. This can be solved by displaying the cached version before the network call is completed. The servicer worker will still do the network call in the background. When a server response is returned we will broadcast a message notifying the app that the news was updated. The app can now refresh the news page.