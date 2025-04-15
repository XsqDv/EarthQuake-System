const puppeteer = require('puppeteer');

const scrapeTweets = async () => {
  const browser = await puppeteer.launch({ headless: true });
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
      console.log('Yeni tweetler:', tweets);
    } else {
      console.log("Yeni deprem tweeti bulunamadı.");
    }
  } catch (error) {
    console.error("Scraping işlemi sırasında bir hata oluştu:", error.message);
  } finally {
    await browser.close();
  }
};

module.exports = scrapeTweets;
