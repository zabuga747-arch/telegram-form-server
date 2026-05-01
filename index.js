import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

// Налаштування
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Тестовий роут (щоб перевірити, що сервер живий)
app.get("/", (req, res) => {
  res.send("Server OK");
});

// Основний роут для форми
app.post("/send-order", async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Перевірка
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing name or phone"
      });
    }

    const text = `
🆕 Нове замовлення:
👤 Ім'я: ${name}
📞 Телефон: ${phone}
    `;

    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: text,
      }
    );

    res.json({
      success: true,
      telegram: response.data
    });

  } catch (error) {
    console.error("❌ Telegram error:", error?.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Failed to send message"
    });
  }
});

// Порт (захист від помилок)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});