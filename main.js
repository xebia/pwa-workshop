fetch('/news')
  .then(
    res => res.json(),
    () => {
      const newsList = document.getElementById('news-list');
      newsList.outerHTML = 'Could not load news';
    }
  )
  .then(news => {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = news
      .map(({ title, time_ago }) => `<li>${title} (${time_ago})</li>`)
      .join('');
  });
