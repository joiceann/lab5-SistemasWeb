/**************************************
 *      Joice Andrea Miranda
 *      Carnet 15552
 ***************************************/


/*
*               REFERENCIAS
*https://www.youtube.com/watch?v=ppiAvvkvAz0&feature=youtu.be
*https://www.npmjs.com/package/node-fetch
*/
const url = 'http://34.210.35.174:7000/'; 
const fetch = require('node-fetch');
const axios = require('axios');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var FormData = require('form-data');
var io = require('socket.io')(server);
var sizeOldMessage=0;

io.on('connection', async function(socket){
	console.log('Alguien se ha conectado con Socket');
	try{
		const old_messages=await axios.get(url);
		console.log('mensajes viejos obtenidos')
		socket.emit('old_messages', old_messages.data);
		sizeOldMessage=old_messages.data.length;
		console.log(sizeOldMessage)
	}
	catch (e){
		console.error(e)
	}

	try{
		socket.on('send_message',function(data){
			// setting data
				console.log("nuevo mensaje")
				console.log(data)
				let message = JSON.parse(data)
				var data = new FormData()
				console.log('id '+ message.id)
				console.log('id '+ message.text)
				console.log('id '+ message.nick)
				data.append('student_id', message.id)
				data.append('text', message.text)
				data.append('nick', message.nick)
				const otherParam={
					method:"POST",
					body: data
				}
				fetch(url,otherParam).then(function(){
					console.log("mensaje enviado")
				})
			})
		}
		catch(e) {
			console.error(e)
		}	
})

async function getMessage(){
	try {
		console.log('metodo de loop')
		const new_message = await axios.get(url)
		const message = new_message.data
		if (message.length !== sizeOldMessage) {
			console.log("tamano diferente")
			let last= message[message.length-1]
		  	io.emit('new_message',last)
		  	sizeOldMessage = message.length
		}
	  } 
	catch(err) {
		console.error(err)
	}
    
}

async function loop (){
	try{
		const new_message = await axios.get(url)
		const message = new_message.data
		sizeOldMessage=message.length
		setInterval(getMessage, 1000);

	}
	catch(err) {
		console.error(err)
	}	
}

loop();

server.listen(8080, function() {
	console.log('Servidor corriendo en http://localhost:8080');
});




