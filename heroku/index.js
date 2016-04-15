/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
 
var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var phase = 0;

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(bodyParser.json());

app.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === 'thay_phay_buc_token') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

app.post('/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      	if (text === 'Generic') {
		sendGenericMessage(sender)
		continue
	}
	else {
		sendTextMessage(sender, "Thầy chưa hiểu ý, con nói lại cho thầy nghe nào.");
	}
	
	if (event.postback) {
		text = JSON.stringify(event.postback)
		sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
		continue
	}
    }
  }
  res.sendStatus(200);
});

var token = "EAAPAkjg4YDkBAKaAjg2JwB20S9L0GwKQwLhIToORBhafvgh5LZADy1Dq1ZCOWvam8CiOPOkuTs9EdbnLEzILcMRzWLkJSp29hbB870aLeBZAKSvNHeWnY2VPU7RggVdRJUiAgZBV4kk8vFy7DHCazBQrBICw2hOle4jvWd2BNwZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
    	console.log('Error: ', response.body.error);
   }
 });
}

function sendGenericMessage(sender) {
	messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

app.listen();
