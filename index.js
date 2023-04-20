require('dotenv').config();
var jsontext = require('./text.json')
var initialButtons = require('./buttons/keyboardButtons.json')
var mentorshipButtons = require('./buttons/mentorshipKeyboardButtons.json')
var propFirmButtons = require('./buttons/propFirmKeyboardButtons.json')
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const { TOKEN, SERVER_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const app = express();
app.use(bodyParser.json());

const init = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
    console.log(res.data);
}

app.post(URI, async (req, res) => {
    if(req.body.message === undefined){
        return
    }
    
    const chatId = req.body.message.chat.id;
    var text = null;
    if (req.body.message.text == '/start') {
        text = jsontext.welcomeText
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: text, reply_markup: initialButtons });
    }
    if (req.body.message.text == 'Mentorship') {
        text = jsontext.mentorshipText
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: text, reply_markup: mentorshipButtons });
    }
    if (req.body.message.text == 'Prop Firm Passing') {
        text = jsontext.propFirmText
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: text, reply_markup: propFirmButtons });
    }
    return res.send();
})

app.listen(process.env.PORT || 5000, async () => {
    console.log('App is running', process.env.PORT || 5000);
    await init();
})