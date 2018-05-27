const root = document.getElementById('root');
fetch('/news')
  .then(
    async res => {
      if(res.status === 200) {
        return res.json();
      }

      const text = await res.text();
      const message = `Received status ${res.status} and body: <pre>${text}</pre>`;
      root.innerHTML = message;
      throw new Error(message);
    },
    () => {
      root.innerHTML = 'Network error while loading news';
    }
  )
  .then(news => {
    root.innerHTML = `<ul>${news
      .map(({ title, time_ago }) => `<li>${title} (${time_ago})</li>`)
      .join('')}</ul>`;
  });
