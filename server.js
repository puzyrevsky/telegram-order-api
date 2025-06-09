const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/sendOrder', async (req, res) => {
  const { name, paramsWeightQuantity, paramsFillings, price, date, phone, description } = req.body;

  if (!name || !paramsWeightQuantity || !Array.isArray(paramsFillings) || !price || !date || !phone) {
    return res.status(400).json({ error: 'Проверьте заполненность полей' });
  }

  const message = `
🧁 Новый заказ: ${name}
📦 Кол-во / Вес: ${paramsWeightQuantity}
🍓 Начинка: ${paramsFillings.join(', ')}
💵 Цена: ${price}
📅 Дата: ${date}
📞 Телефон: ${phone}
📝 Описание: ${description || '—'}
  `;

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: message,
    });
    res.json({ ok: true });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Не удалось отправить сообщение' });
  }
});

app.get('/', (req, res) => {
  res.send('Telegram order API is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));