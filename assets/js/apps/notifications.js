//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

const generarNot  = document.getElementById('generarNot');
const notWrapper  = document.getElementById('notWrapper');
const notTotal    = document.getElementById('notTotal');
const notList     = document.getElementById('notList');

generarNot.addEventListener('click', generarNotificacion);
async function generarNotificacion(e) {
  const payload = {
    csrf: Bee.csrf
  };

  generarNot.disabled = true;
  const res = await fetch('ajax/generar-notificacion', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .catch(err => alert(err));

  if (res.status !== 201) {
    toastr.error(res.msg);
    return;
  }

  generarNot.disabled = false;
  toastr.success(res.msg, 'NotificaciÃ³n generada');
  return;
}

// Actualizar el estado de una notificaciÃ³n
async function actualizarNotificacion(id) {
  const payload = {
    csrf: Bee.csrf,
    id: id
  }
  return await fetch('ajax/actualizar-notificacion', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .catch(err => alert(err));
}

const eventSource = new EventSource('ajax/sse');
const audio       = new Audio(`${Bee.uploaded}alerta.mp3`);

eventSource.onmessage = event => {
  const res            = JSON.parse(event.data);
  const totales        = res.data.totales;
  const pendientes     = res.data.pendientes;
  const cargadas       = res.data.cargadas;
  const vistas         = res.data.vistas;
  const notificaciones = res.data.notificaciones;

  if (res.status !== 200) {
    notTotal.innerHTML = 0;
    notList.innerHTML  = `<li class="dropdown-item">${res.msg}</li>`;
    return;
  }

  // Si no hay notificaciones
  if (totales === 0) {
    notTotal.innerHTML = 0;
    notList.innerHTML  = `<li class="dropdown-item">No hay notificaciones.</li>`;
    return;
  }

  // Muestra la notificaciÃ³n en un elemento HTML
  notList.innerHTML = '';
  notificaciones.forEach(notificacion => {
    // Crear un elemento HTML para la notificaciÃ³n
    const notificacionElemento = document.createElement("li");
    notificacionElemento.classList.add('dropdown-item');

    // Agregar el contenido de la notificaciÃ³n
    notificacionElemento.innerHTML = notificacion.titulo;

    // Si no ha sido vista aÃºn
    if (notificacion.status !== 'vista') {
      notificacionElemento.classList.add('bg-light', 'text-dark');

      // Agrega un manejador de eventos para el hover
      notificacionElemento.addEventListener("mouseenter", async function (e) {
        // Actualiza el estado de la notificaciÃ³n en la base de datos
        const res = await actualizarNotificacion(notificacion.id);
        if (res.status !== 200) {
          return;
        }

        // Actualizar los estilos del elemento
        notificacionElemento.classList.remove('bg-light', 'text-dark');

        // Restar uno al total de notificaciones
        let notTotalPendientes = parseInt(notTotal.innerHTML);
        notTotal.innerHTML     = notTotalPendientes > 0 ? notTotalPendientes - 1 : 0;
      });
    }

    // Agregar la notificaciÃ³n al contenedor de notificaciones
    notList.appendChild(notificacionElemento);
  });

  // Actualizar la burbuja de nuevas notificaciones
  notTotal.innerHTML = totales - vistas;

  // Reproducir el sonido de notificaciones sÃ³lo si hay nuevas
  if (pendientes > 0) {
    audio.play();
  }
};