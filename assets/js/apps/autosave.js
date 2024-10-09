const autosaveForm    = document.getElementById('autosaveForm');
const btnSubmit       = document.getElementById('btnSubmit');
const timerWrapper    = document.getElementById('timer');
const statusMessage   = document.getElementById('statusMessage');
const saving          = '<i class="fas fa-save fa-fw"></i> Guardando...';
const autosaveIn      = 5000; // milisegundos

const responseWrapper = document.getElementById('responseWrapper');

const id              = autosaveForm.querySelector('#id');
const titulo          = autosaveForm.querySelector('#titulo');
const contenido       = autosaveForm.querySelector('#contenido');

let autosaveTimer; // Variable para almacenar el temporizador
let timer = 0; // Segundos transcurridos

// FunciÃ³n para guardar un registro en la db
async function save(payload) {
  return await fetch('ajax/save', {
    method: 'POST',
    body  : JSON.stringify(payload)
  })
  .then(res => res.json())
  .catch(error => alert(error));
}

// Mostrar el tiempo transcurrido
function showTimer() {
  setInterval(() => {
    timer++;
    timerWrapper.innerHTML = timer;
  }, 1000);
}
showTimer();

// Reiniciar el temporizador cada vez que el usuario interactÃºa
function resetAutosaveTimer() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(autoSave, autosaveIn); // Guardar despuÃ©s de xyz segundos de inactividad
  timer         = 0; // reiniciar el reloj
}

// Escuchar eventos de entrada en los campos
titulo.addEventListener('input', resetAutosaveTimer);
contenido.addEventListener('input', resetAutosaveTimer);

// FunciÃ³n para guardar automÃ¡ticamente
async function autoSave() {
  const payload = {
    csrf     : Bee.csrf,
    id       : id.value.trim(),
    titulo   : titulo.value.trim(),
    contenido: contenido.value.trim()
  };

  // Validar que haya contenido
  if (payload.titulo == '' && payload.contenido == '') return;

  statusMessage.innerHTML = saving;
  statusMessage.classList.remove('d-none', 'text-danger', 'text-muted');
  statusMessage.classList.add('text-muted');

  // Desactivar el botÃ³n
  btnSubmit.disabled = true;

  // Guardar la noticia en la base de datos
  const res = await save(payload);

  // Activar el botÃ³n
  btnSubmit.disabled = false;

  if (res.status !== 200) {
    toastr.error(res.msg);
    statusMessage.innerHTML = '';
    statusMessage.classList.add('d-none');
    return;
  }

  // Mostrar el bloque de cÃ³digo
  responseWrapper.innerHTML = `<code>${JSON.stringify(res, null, 2)}</code>`;
  responseWrapper.classList.remove('d-none');

  // Establecer el ID del registro
  id.value = res.data.id;

  // Mensajes de Ã©xito
  toastr.success(res.msg, 'Autoguardado');
  statusMessage.innerHTML = `<i class="fas fa-check fa-fw"></i> ${res.msg}`;
  statusMessage.classList.add('text-success');
  setTimeout(() => {
    statusMessage.innerHTML = '';
    statusMessage.classList.add('d-none');
  }, 2500);
  
  return true;
}

// Guardar al presionar el botÃ³n de guardado
autosaveForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const payload = {
    csrf     : Bee.csrf,
    id       : id.value.trim(),
    titulo   : titulo.value.trim(),
    contenido: contenido.value.trim()
  };

  // Validar que haya contenido
  if (payload.titulo == '') {
    toastr.error('Completa el tÃ­tulo de la noticia por favor.');
    return;
  };

  // Desactivar el botÃ³n de guardado
  btnSubmit.disabled = true;

  // Guardar el registro en la base de datos
  const res = await save(payload);

  if (res.status !== 200) {
    toastr.error(res.msg);
    return;
  }

  toastr.success(res.msg);
  btnSubmit.disabled = false;

  // Borrar el timeout para que sÃ³lo empiece a contar de nuevo hasta que se haga input
  clearInterval(autosaveTimer);

  return true;
});