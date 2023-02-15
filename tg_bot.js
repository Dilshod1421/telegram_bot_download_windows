require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const UsersBot = require('./models/connect.js');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

//================================== bot commands ==========================================
bot.setMyCommands([
    { command: '/start', description: 'Botni ishga tushurish' },
    { command: '/clear', description: "Chatni tozalash" }
]);


//================================== function for sendMessage ==============================
const additions = (texts, rows) => {
    let allArrays = [];
    let index = 0;
    for (let i = 0; i < rows.length; i++) {
        let arrayForObject = [];
        for (let j = 0; j < rows[i]; j++) {
            let objectForText = {};
            objectForText.text = texts[index++];
            arrayForObject.push(objectForText);
        };
        allArrays.push(arrayForObject);
    }
    let objectadditions = {
        reply_markup: JSON.stringify({ keyboard: allArrays, resize_keyboard: true })
    };
    return objectadditions;
};


//================================== variables for function ==============================
const backButtons = ["Orqaga ⬅️", "Asosiy sahifa ↩️"]
const main = additions(["Operatsion sistemalar 📲", "Arxivlar paroli 🗝️", "Arxivdan chiqarish qo'llanmasi 📃", "Statistika 📊"], [1, 1, 2]);
const o_systems = additions(["Windows", "Linux", "MacOS", "AndroidOs", ...backButtons], [2, 1, 1, 2]);
const windows = additions(["x32", "x64", ...backButtons], [2, 2]);
const x64 = additions(["Windows 11", "Windows 10", "Windows 8", "Windows 7", "Windows Vista", ...backButtons], [3, 2, 2]);
const windows11 = additions(["Windows 11 Russian Pro 21H2", "Windows 11 by SmokieBlahBlah", "Windows 11 21H2 by Tatata", "Windows 11 21H2 by OneSmile", "Windows 11 Compact&Full by flibustier", "Windows 11 21H2 Pro Insider", "Windows 11 21H2 rus gx", "Windows 11 21H2 by Ovgorskiy", "Windows 11 21H2 Enterprice by Zosma", "Windows 11 IoT Enterprice by Xalex", "Windows 11 Pro 21H2 by OneSmile", "Windows 11 IP LTSC by Djannet", ...backButtons], [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2]);


//=================================== start bot =============================
const startBot = async () => {
    try {
        mongoose.set('strictQuery', false);
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, console.log("Mongo DB connected"));
    }
    catch (err) {
        console.log(err);
    }
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (!(await UsersBot.findOne({ userId: chatId }))) {
            const user_data = {
                userId: chatId,
                first_name: msg.chat.first_name,
                last_name: msg.chat.last_name,
                username: msg.chat.username
            };
            await UsersBot.create(user_data);
        }
        const filter = {};
        const users = await UsersBot.find(filter);

        if (text === '/start' || text === "Asosiy sahifa ↩️") {
            return bot.sendMessage(chatId, `Assalomu alaykum ${msg.chat.first_name}. Botga xush kelibsiz!`, main);
        };

        if (text === "Arxivlar paroli 🗝️") {
            return bot.sendPhoto(chatId, './images/abudev.png', { caption: "Arxiv paroli rasmda ko'rsatilgan 😊" });
        };

        if (text === "Arxivdan chiqarish qo'llanmasi 📃") {
            return bot.sendPhoto(chatId, './images/arxiv.jpg', { caption: "Ko`p faylli arxivlarni arxivdan xalos qilish uchun qo`llanma !!!" });
        };

        if (text === "Statistika 📊") {
            return bot.sendMessage(chatId, `👥 Botdagi obunachilar soni ${users.length} ta`);
        };

        if (text === "Operatsion sistemalar 📲") {
            return bot.sendMessage(chatId, "Operatsion sistemalardan birini tanlang.", o_systems);
        };

        if (text === "Windows") {
            return bot.sendMessage(chatId, "Windows razryadlaridan birini tanlang.", windows);
        };

        if (text === 'x64') {
            return bot.sendMessage(chatId, "Windows versiyalaridan birini tanlang.", x64);
        };

        if (text === 'Windows 11') {
            return bot.sendMessage(chatId, "Windows 11 turlarining birini tanlang.", windows11);
        };

        
    });
};
startBot();