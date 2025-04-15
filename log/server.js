const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Token dosyası
const TOKEN_FILE = './token.txt';

// Web sunucu başlat
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Yeni token oluştur ve kaydet
const generateToken = () => {
  const token = uuidv4(); // uuidv4 ile benzersiz bir token oluştur
  fs.writeFileSync(TOKEN_FILE, token); // Token'ı kaydet
  return token;
};

// Token kontrolü ve doğrulama işlemi
app.get('/', (req, res) => {
  const token = generateToken();  // Yeni token oluştur
  res.send(`
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Deprem Log Veri Doğrulama</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          background-color: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 400px;
          text-align: center;
          animation: fadeIn 1s ease-in-out;
        }
        h1 {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }
        form {
          margin-top: 20px;
        }
        input[type="text"] {
          width: 80%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          padding: 10px 20px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #218838;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Deprem Log Veri Doğrulama</h1>
        <p>Doğrulama için aşağıdaki token'ı girin:</p>
        <form action="/verify" method="post">
          <label for="token">Token: </label>
          <input type="text" id="token" name="token" required>
          <button type="submit">Doğrula</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// Token doğrulama işlemi
app.post('/verify', (req, res) => {
  const userToken = req.body.token;  // Kullanıcının girdiği token
  const validToken = fs.readFileSync(TOKEN_FILE, 'utf8');  // Kaydedilen token

  if (userToken === validToken) {
    // Doğrulama başarılı, Deprem Detayları sayfasına yönlendir
    res.redirect('/deprem_detaylari');
  } else {
    res.send('<h1>Doğrulama Hatalı! Lütfen geçerli bir token girin.</h1>');
  }
});

// Deprem Detayları sayfası
app.get('/deprem_detaylari', (req, res) => {
  // Deprem bilgilerini buraya getireceğiz
  res.send('<h1>Deprem Detayları Burada Görünecek!</h1>');
  // Gerçek deprem bilgisi için scraping işlemini yapabiliriz
});

// Sunucu başlat
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
