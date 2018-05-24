fetch('/news')
  .then(res => res.json())
  .then(news => {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = news
      .map(({ title }) => `<li>${title}</li>`)
      .join('');
  });

console.log('wa')