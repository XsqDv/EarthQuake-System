const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();

// Deprem bilgilerini çekme işlemi
const scrapeTweets = async () => {
  const browser = await puppeteer.launch({ headless: true });  // Tarayıcıyı başlat
  const page = await browser.newPage();

  try {
    await page.goto('https://x.com/DepremDairesi', { waitUntil: 'networkidle2' });

    const tweets = await page.$$eval('article', (articles) => {
      return articles.map(article => {
        const time = article.querySelector('time')?.getAttribute('datetime');
        const text = article.querySelector('div[lang]')?.innerText.trim();

        if (time && text) {
          return { time: time, text: text };
        }
        return null;
      }).filter(Boolean);
    });

    if (tweets.length > 0) {
      return tweets[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Scraping işlemi sırasında bir hata oluştu:", error.message);
    return null;
  } finally {
    await browser.close();  // Tarayıcıyı kapat
  }
};

// Deprem Detayları sayfası
app.get('/deprem_detaylari', async (req, res) => {
  const tweet = await scrapeTweets();
  
  if (tweet) {
    res.send(`
      <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Deprem Detayları</title>
        </head>
        <body>
          <h1>Son Deprem Detayları</h1>
          <p><strong>Zaman:</strong> ${tweet.time}</p>
          <p><strong>Deprem Detayları:</strong> ${tweet.text}</p>
        </body>
      </html>
    `);
  } else {
    res.send('<h1>Deprem Detayları Bulunamadı.</h1>');
  }
});

// Sunucu başlat
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Deprem Detayları Servisi ${PORT} portunda çalışıyor...`);
});
