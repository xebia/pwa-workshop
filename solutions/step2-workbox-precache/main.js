fetch('/news')
  .then(res => res.json())
  .then(news => {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = news
      .map(({ title, time_ago }) => `<li>${title} (${time_ago})</li>`)
      .join('');
  });
