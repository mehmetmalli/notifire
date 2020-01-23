const TelegramBot = require('node-telegram-bot-api');
const token = 'BOT_TOKEN_HERE';
const bot = new TelegramBot(token, { polling: true });

const dbActions = require('./index.js');

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id.toString();
	bot.sendMessage(chatId, `/get - Assigns you an ID and sends it as a message to you\n/how - Tutorial`, {
		parse_mode: 'HTML'
	});
});

bot.onText(/\/get/, (msg) => {
	const chatId = msg.chat.id.toString();
	dbActions.addID(chatId).then((id) => {
		bot.sendMessage(chatId, `<b>Your notification ID: </b>\n\n${id}`, { parse_mode: 'HTML' });
	});
});

bot.onText(/\/how/, (msg) => {
	const chatId = msg.chat.id.toString();
	bot.sendMessage(chatId, `<b> Video link or written tutorial (or both) </b>`, { parse_mode: 'HTML' });
});

module.exports.botSendMessage = function botSendMessage(userId, message) {
	bot.sendMessage(userId, message, { parse_mode: 'HTML' });
};
