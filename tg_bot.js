require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const UsersBot = require('./models/connect.js');
const fs = require('fs');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

//================================== bot commands ==========================================
bot.setMyCommands([
    { command: '/start', description: 'Botni ishga tushurish' }
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
const backButtons = ["Orqaga ⬅️", "Asosiy menu ↩️"]
const start = additions(["Operatsion sistemalar 📲", "Arxivlar paroli 🗝️", "Arxivdan chiqarish qo'llanmasi 📃", "Statistika 📊"], [1, 1, 2]);
const o_systems = additions(["Windows", "Linux", "MacOS", "AndroidOs", ...backButtons], [2, 1, 1, 2]);
const windows = additions(["x32", "x64", ...backButtons], [2, 2]);
const x64 = additions(["Windows 11", "Windows 10", "Windows 8", "Windows 7", "Windows Vista", ...backButtons], [3, 2, 2]);
const x32 = additions(["Windows 10 | 32", "Windows 8 | 32", "Windows 7 | 32", "Windows Vista | 32", "Windows XP | 32", "Windows 98 | 32", ...backButtons], [1, 2, 1, 2, 2]);
const windows11 = additions(["Windows 11 Russian Pro 21H2", "Windows 11 by SmokieBlahBlah", "Windows 11 21H2 by Tatata", "Windows 11 21H2 by OneSmile", "Windows 11 Compact&Full by flibustier", "Windows 11 21H2 Pro Insider", "Windows 11 21H2 rus gx", "Windows 11 21H2 by Ovgorskiy", "Windows 11 21H2 Enterprice by Zosma", "Windows 11 IoT Enterprice by Xalex", "Windows 11 Pro 21H2 by OneSmile", "Windows 11 IP LTSC by Djannet", ...backButtons], [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2]);
const windows10 = additions(["1507 | x64", "1511 | x64", "1606 | x64", " 1703 | x64", "1709 | x64", "1803 | x64", "1809 | x64", "1903 | x64", "1909 | x64", "2004 | x64", "20H2 | x64", "21H1 | x64", "21H2 | x64", ...backButtons], [2, 3, 2, 1, 2, 2, 1, 2]);
const windows8 = additions(["Professional | x64", "Enterprice | x64", ...backButtons], [1, 1, 2]);
const windows7 = additions(["Ultimate | x64", ...backButtons], [1, 2]);
const windows10_32 = additions(["1507", "1511", "1607", "1703", "1709", "1803", "1809", "1903", "1909", "2004", "20H2", "21H1", "21H2", ...backButtons], [2, 3, 2, 1, 4, 1, 2]);
const windows8_32 = additions(["Professional | x32", "Enterprice | x32", ...backButtons], [1, 1, 2]);
const windows7_32 = additions(["Ultimate | x32", ...backButtons], [1, 2]);
const windowsxp_32 = additions(["Professional", "Chip", ...backButtons], [1, 1, 2]);
const linux = additions(["Ubuntu", "Kali", "PureOs", "Debian", "CentOS", "Puppy", "BlackLab", "Arch Linux", "Slackware", "Solus", "Bodhi Linux", "Xubuntu", "Zorin Linux", "PCLinuxOs", ...backButtons], [2, 2, 3, 3, 2, 2, 2]);
let to_back = [];
const windows64 = JSON.parse(fs.readFileSync('./models/windows.json', 'utf8'));
const windows32 = JSON.parse(fs.readFileSync('./models/windows32.json', 'utf8'));
const linux_versions = JSON.parse(fs.readFileSync('./models/linux.json', 'utf8'));


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
        let text = msg.text;
        const chatId = msg.chat.id;
        if (!(await UsersBot.findOne({ userId: chatId }))) {
            const user_data = {
                userId: chatId,
                first_name: msg.chat.first_name,
                last_name: msg.chat.last_name,
                username: msg.chat.username
            };
            await UsersBot.create(user_data);
        };
        const filter = {};
        const users = await UsersBot.find(filter);
        if (!to_back.includes(text) && text != "Orqaga ⬅️") {
            to_back.push(text);
        };

        if (text == "Orqaga ⬅️" && to_back.at(-1) != "Asosiy menu ↩️") {
            to_back.splice(to_back.length - 1, 1);
            text = to_back.at(-1);
        };

        if (text == '/start' || text == "Asosiy menu ↩️") {
            return bot.sendMessage(chatId, `Assalomu alaykum ${msg.chat.first_name}. Botga xush kelibsiz!`, start);
        };

        if (text == "Arxivlar paroli 🗝️") {
            return bot.sendPhoto(chatId, './images/abudev.png', { caption: "Arxiv paroli rasmda ko'rsatilgan 😊" });
        };

        if (text == "Arxivdan chiqarish qo'llanmasi 📃") {
            return bot.sendPhoto(chatId, './images/arxiv.jpg', { caption: "Ko`p faylli arxivlarni arxivdan xalos qilish uchun qo`llanma !!!" });
        };

        if (text == "Statistika 📊") {
            return bot.sendMessage(chatId, `👥 Botdagi obunachilar soni ${users.length} ta\n\n@operatsionSystems_bot statistikasi`);
        };

        if (text == "Operatsion sistemalar 📲") {
            return bot.sendMessage(chatId, "Operatsion sistemalardan birini tanlang", o_systems);
        };

        if (text == "Windows") {
            return bot.sendMessage(chatId, "Windows razryadlaridan birini tanlang", windows);
        };

        if (text == "Linux") {
            return bot.sendMessage(chatId, "Linux versiyalaridan birini tanlang", linux);
        };

        for (let i of linux_versions) {
            if (text == i[0]) {
                to_back.pop();
                return bot.sendPhoto(chatId, i[1], { caption: `${i[0]}\n${i[2]}` });
            };
        };

        if (text == 'x64') {
            return bot.sendMessage(chatId, "Windows versiyalaridan birini tanlang", x64);
        };

        if (text == 'x32') {
            return bot.sendMessage(chatId, "Windows versiyalar birini tanlang", x32);
        };

        if (text == 'Windows 11') {
            return bot.sendMessage(chatId, "Windows 11 turlarining birini tanlang", windows11);
        };

        if (text == 'Windows 10') {
            return bot.sendMessage(chatId, "Windows 10 turlarining birini tanlang", windows10);
        };

        if (text == 'Windows 8') {
            return bot.sendMessage(chatId, "Windows 8 turlarining birini tanlang", windows8);
        };

        if (text == 'Windows 7') {
            return bot.sendMessage(chatId, "Windows 7 Ultimate", windows7);
        };

        if (text == 'Windows 10 | 32') {
            return bot.sendMessage(chatId, "Windows 10 | 32 turlarining birini tanlang", windows10_32);
        };

        if (text == 'Windows 8 | 32') {
            return bot.sendMessage(chatId, "Windows 8 | 32 turlarining birini tanlang", windows8_32);
        };

        if (text == 'Windows 7 | 32') {
            return bot.sendMessage(chatId, "Windows 7 Ultimate", windows7_32);
        };

        if (text == 'Windows XP | 32') {
            return bot.sendMessage(chatId, "Windows 10 | 32 turlarining birini tanlang", windowsxp_32);
        };

        for (let i of windows64) {
            if (text == i[0]) {
                to_back.pop();
                return bot.sendPhoto(chatId, i[1], { caption: `${i[0]}\n${i[2]}` });
            };
        };

        for (let i of windows32) {
            if (text == i[0]) {
                to_back.pop();
                return bot.sendPhoto(chatId, i[1], { caption: `${i[0]}\n${i[2]}` });
            };
        };

        bot.sendMessage(chatId, "Kechirasiz, bunday buyruq yo'q!");
    });
};
startBot();