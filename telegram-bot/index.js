const express = require('express');

const app = express();

const firebase = require('firebase');
require('firebase/firestore');

const cfg = require('./firebase-config.js'); //firebase configuration

let bot = require('./telegram.js');

//Initialize Firebase
firebase.initializeApp(cfg);

//get firebase db instance
let db = firebase.firestore().collection('users');

app.listen(80, () => console.log('Server is listening for connections on port 80 ...'));

app.get('/:id', (req, res) => {
	let notificationID = req.params.id;
	getTelegramID(notificationID).then((telegramID) => {
		bot.botSendMessage(telegramID, `<b>> Task complete.</b>`);
	});
	return res.send();
});

app.get('/:id/:msg', (req, res) => {
	let notificationID = req.params.id;
	let msg = req.params.msg;
	getTelegramID(notificationID).then((telegramID) => {
		bot.botSendMessage(telegramID, `<b>> Task complete.\n\nMessage:</b> ${msg}`);
	});
	return res.send();
});

//generate id
let getRandomID = async () => {
	let id;
	let unique = false;
	while (!unique) {
		id = Math.random().toString(36).slice(-8);
		await idExists(id).then((res) => {
			unique = !res;
		});
	}
	return id;
};

//check if notification id exists
let idExists = async (id) => {
	let result;
	await db.doc(id).get().then((res) => {
		result = res.exists;
	});
	return result;
};

let telegramIDExists = async (telegramID) => {
	let result = [];
	await db.where('telegramID', '==', telegramID).get().then((snapshot) => {
		snapshot.forEach((doc) => {
			result.push(doc.data());
		});
	});
	return result;
};

let getTelegramID = async (id) => {
	let telegramID = null;
	await db.doc(id).get().then((user) => {
		user.exists && (telegramID = user.data().telegramID);
	});
	return telegramID;
};

//add user to db with telegramID and return generated id
let addID = async (telegramID) => {
	await telegramIDExists(telegramID).then((res) => {
		if (res.length > 0) {
			final_id = res[0].id;
		} else {
			getRandomID().then((id) => {
				final_id = id;
				db.doc(id).set({ id, telegramID });
			});
		}
	});
	return final_id;
};

module.exports.addID = addID;
