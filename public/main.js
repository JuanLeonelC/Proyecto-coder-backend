const socket = io();
const knexConfig = require('../src/services/database/config.js');
const knex = require('knex')(knexConfig);

if(getParameterByName('username') == '' || getParameterByName('username') == null){
    window.location.replace("/login.html");
}

let messages = []

function sendNewMessage(){
    const message = document.querySelector('#message').value;
    const username = getParameterByName('username');
    if(!message || !username){
        alert('faltan datos');
        return
    }
    const messageObject = {
        username,
        message
    }
    socket.emit('NEW_MESSAGE_TO_SERVER', messageObject);
    document.querySelector('#message').value = '';
}

function updateMessages(data){
    knex('chatlogs').insert(data).then(()=> {
        console.info('chat log saved')
    }).catch(err =>{
        console.error(err)
    }).finally(() =>{
        knex.destroy();
    });
    let messagesToHtml = ''
    data.forEach(i => {
        messagesToHtml = messagesToHtml + `<li><b class="text-primary fs-bold">${i.username}: </b><b class="text-warning">${Date()}</b>: <i class="text-success">${i.message}</i></li>`
    })
    document.querySelector('#messagesList').innerHTML = messagesToHtml;
}



socket.on('UPDATE_DATA', (data) => {
    messages = data
    updateMessages(data)
    console.log(data)
});

socket.on('NEW_MESSAGE_FROM_SERVER', (data) => {
    messages.push(data)
    updateMessages(messages)
});

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}