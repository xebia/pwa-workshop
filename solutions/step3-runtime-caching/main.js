const root = new Promise(resolve => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    return resolve(rootElement);
  }
  document.addEventListener("DOMContentLoaded", () => {
    resolve(document.getElementById('root'));
  });
});

fetch('/news')
  .then(
    async res => {
      if(res.status === 200) {
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
  .then(async news => {
    (await root).innerHTML = `<ul>${news
      .map(({ title, time_ago }) => `<li>${title} (${time_ago})</li>`)
      .join('')}</ul>`;
  });
