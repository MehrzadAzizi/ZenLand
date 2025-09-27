const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/deploy', (req, res) => {
  res.send('در حال دیپلوی قرارداد...');
});

app.get('/send', (req, res) => {
  res.send('در حال ارسال توکن ZTC...');
});

app.get('/create', (req, res) => {
  res.send('در حال ساخت توکن جدید...');
});

app.listen(port, () => {
  console.log(' ZenMint clone running at http://localhost:${port} ');
});