
//lado del cliente
const socket = io();

const chatButton = document.getElementById('chatButton');
const messageParagraph = document.getElementById('messageParagraph');
const inputValue = document.getElementById('chatBox');

let user;

Swal.fire({
    title: 'Identificacion de usuario',
    text: 'Por favor ingrese su nombre de usuario',
    input: 'text',
    inputValidator: (valor) => {
        return !valor && 'Ingrese su nombre de usuario';
    },
    //esto es para que no pueda evitar el mensaje. Aparece la alerta y no puede evitarlo
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value;
    console.log(user);
})



chatButton.addEventListener('click', () => {
    let actualDate = new Date().toLocaleString();

    if (inputValue.value.trim().length > 0) {
        socket.emit('message', { date: actualDate, user: user, message: inputValue.value })
        inputValue.value = '';
    }
})


socket.on('message', (messagesArray) => {
    messageParagraph.innerHTML = '';
    messagesArray.forEach(message => {
        messageParagraph.innerHTML += `<p>${message.date} : El usuario ${message.user} escribio: ${message.message}</p>`;
    })
})