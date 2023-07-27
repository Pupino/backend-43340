const socket = io();

let email = '';

async function asyncWraper() {
  const { value: emailIngresado } = await Swal.fire({
    title: 'Ingresa tu email',
    input: 'text',
    inputLabel: 'Tu email',
    inputValue: '',
    showCancelButton: false,
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return 'Por favor completar';
      }
    },
  });
  email = emailIngresado;
  document.getElementById('span-email').innerHTML = email;
}

asyncWraper();

const chatBox = document.getElementById('input-msg');

chatBox.addEventListener('keyup', ({ key }) => {
  if (key == 'Enter') {
    socket.emit('msg_front_to_back', {
      message: chatBox.value,
      user: email,
    });
    chatBox.value = '';
  }
});

socket.on('todos_los_msgs', (msgs) => {
  const divMsgs = document.getElementById('div-msgs');
  let contenido = '';
  msgs.forEach((msg) => {
    contenido = contenido + `<p>${msg.user} dice: ${msg.message}</p>`;
  });
  divMsgs.innerHTML = contenido;
  window.scrollTo(0, document.body.scrollHeight);
});
