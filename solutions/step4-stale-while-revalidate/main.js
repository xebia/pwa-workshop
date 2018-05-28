if (/ngrok\.io$/.test(location.host) && location.protocol != 'https:') {
  location.href = 'https:' + location.href.substring(location.protocol.length);
}

const root = new Promise(resolve => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    return resolve(rootElement);
  }
  document.addEventListener("DOMContentLoaded", () => {
    resolve(document.getElementById('root'));
  });
});

const renderNews = async news => {
  (await root).innerHTML = `<ul>${news
  .map(({ title, time_ago }) => `<li>${title} (${time_ago})</li>`)
  .join('')}</ul>`;
};

fetch('/news')
  .then(
    async res => {
      if (res.status === 200) {
        return res.json();
      }

      const text = await res.text();
      const message = `Received status ${res.status} and body: <pre>${text}</pre>`;
      (await root).innerHTML = message;
      throw new Error(message);
    },
    async () => {
      (await root).innerHTML = 'Network error while loading news';
    }
  )
  .then(renderNews);


const updatesChannel = new BroadcastChannel('api-updates');
updatesChannel.addEventListener('message', async (event) => {
  const { cacheName, updatedUrl } = event.data.payload;
  const cache = await caches.open(cacheName);
  const updatedResponse = await cache.match(updatedUrl);
  const news = await updatedResponse.json();
  return renderNews(news)
});
