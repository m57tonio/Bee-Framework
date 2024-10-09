//////////////////////////////////////////////////////////////////
  // Actualización de temario
  $('#temario_form').on('submit', temario_form);
  function temario_form(e) {
    e.preventDefault();

    var form    = $(this),
    data        = new FormData(form.get(0));
    
    // AJAX
    $.ajax({
      url: 'ajax/temario_form',
      type: 'post',
      dataType: 'json',
      contentType: false,
      processData: false,
      cache: false,
      data : data,
      beforeSend: function() {
        form.waitMe();
      }
    }).done(function(res) {
      if(res.status === 200) {
        toastr.success(res.msg, '¡Bien!');
      } else {
        toastr.error(res.msg, '¡Upss!');
      }
    }).fail(function(err) {
      toastr.error('Hubo un error en la petición', '¡Upss!');
    }).always(function() {
      form.waitMe('hide');
    })
  }

  /**
   * Agragando una nueva lección
   */
  $('#add_leccion_form').on('submit', add_leccion_form);
  function add_leccion_form(e) {
    e.preventDefault();

    var form = $(this),
    data     = new FormData(form.get(0));
    
    // AJAX
    $.ajax({
      url: 'ajax/add_leccion_form',
      type: 'post',
      dataType: 'json',
      contentType: false,
      processData: false,
      cache: false,
      data : data,
      beforeSend: function() {
        form.waitMe();
      }
    }).done(function(res) {
      if(res.status === 201) {
        toastr.success(res.msg, '¡Bien!');
        form.trigger('reset');

        // Vamos a llamar a la función para recargar el listado de lecciones
        get_lecciones();
      } else {
        toastr.error(res.msg, '¡Upss!');
      }
    }).fail(function(err) {
      toastr.error('Hubo un error en la petición', '¡Upss!');
    }).always(function() {
      form.waitMe('hide');
    })
  }

  // Cargar lista de lecciones
  get_lecciones();
  function get_lecciones() {
     
    var wrapper = $('.wrapper_lecciones'),
    id          = wrapper.data('id'),    
    action      = 'get',
    csrf     = Bee.csrf;

    if (wrapper.length === 0) {
      return;
    }

    $.ajax({
      url: 'ajax/get_lecciones',
      type: 'POST',
      dataType: 'json',
      cache: false,
      data: {
       csrf , action, id
      },
      beforeSend: function() {
        wrapper.waitMe();
      }
    }).done(function(res) {
      if(res.status === 200) {
        wrapper.html(res.data);
        init_lecciones_acordion();
        re_enumerar();

      } else {
        toastr.error(res.msg, '¡Upss!');
        wrapper.html(res.msg);
      }
    }).fail(function(err) {
      console.log('hubo un error'+err)
      toastr.error('Hubo un error en la petición', '¡Upss!');
      wrapper.html('Hubo un error al cargar las lecciones, intenta más tarde.');
    }).always(function() {
      wrapper.waitMe('hide');
    })
  }

  // Inicializa el plugin o widget del acordeon
  function init_lecciones_acordion() {
    $( "#accordion" )
    .accordion({
      header: "> div > h3",
      collapsible: true
    })
    .sortable({
      axis: "y",
      handle: "h3",
      stop: function( event, ui ) {
        // IE doesn't register the blur when sorting
        // so trigger focusout handlers to remove .ui-state-focus
        ui.item.children( "h3" ).triggerHandler( "focusout" );
        
        // Refresh accordion to handle new order
        $( this ).accordion( "refresh" );
        save_new_order();
      }
    });
  }

  // Guarda el nuevo orden de las lecciones
  function save_new_order() {
    var acordion = $('#accordion'),
    divs         = $('.group', acordion),
    lecciones    = [],
    action       = 'put',
    csrf     = Bee.csrf,
    wrapper      = $('.wrapper_lecciones');

    // Mapear el nuevo array
    divs.map(function(i, leccion) {
      var leccion = {'index': i, 'id': leccion.getAttribute('data-id')};
      lecciones.push(leccion);
    });

    // Petición http
    $.ajax({
      url: 'ajax/save_new_order',
      type: 'post',
      dataType: 'json',
      cache: false,
      data : {action, csrf, lecciones},
      beforeSend: function() {
        wrapper.waitMe();
      }
    }).done(function(res) {
      if(res.status === 200) {
        toastr.success(res.msg, '¡Bien!');
        re_enumerar();

      } else {
        toastr.error(res.msg, '¡Upss!');
      }
    }).fail(function(err) {
      toastr.error('Hubo un error en la petición', '¡Upss!');
    }).always(function() {
      wrapper.waitMe('hide');
    })
  }

  function re_enumerar() {
    var acordion = $('#accordion'),
    divs         = $('.group', acordion);

    divs.each(function(i, leccion) {
      var h3 = $('h3', leccion);
      
      $('span.numeracion', h3).html('#' + (i + 1) + ' ');
    })
  }

  // Borrar una lección
  $('body').on('click', '.delete_leccion', delete_leccion);
  function delete_leccion(e) {
    var boton   = $(this),
    id          = boton.data('id'),
    csrf     = Bee.csrf,
    action      = 'delete';

    if(!confirm('¿Estás seguro?')) return false;

    $.ajax({
      url: 'ajax/delete_leccion',
      type: 'POST',
      dataType: 'json',
      cache: false,
      data: {
        csrf, action, id
      },
      beforeSend: function() {
        $('body').waitMe();
      }
    }).done(function(res) {
      if(res.status === 200) {
        toastr.success(res.msg, '¡Bien!');
        get_lecciones();
      } else {
        toastr.error(res.msg, '¡Upss!');
      }
    }).fail(function(err) {
      toastr.error('Hubo un error en la petición', '¡Upss!');
    }).always(function() {
      $('body').waitMe('hide');
    })
  }

  // Cargar información de lección
  $('body').on('click', '.open_update_leccion_form', open_update_leccion_form);
  function open_update_leccion_form(e) {
    e.preventDefault();

    var button = $(this),
    id         = button.data('id'),
    action     = 'get',
    csrf     = Bee.csrf,
    form_a     = $('#add_leccion_form'),
    form_e     = $('#update_leccion_form');

    // Cargar la información del registro de la lección
    $.ajax({
      url: 'ajax/open_update_leccion_form',
      type: 'POST',
      dataType: 'json',
      cache: false,
      data: {
        csrf, action, id
      },
      beforeSend: function() {
        $('body').waitMe();
      }
    }).done(function(res) {
      if(res.status === 200) {
        $('[name="id"]', form_e).val(res.data.id);
        $('[name="titulo"]', form_e).val(res.data.titulo);
        $('[name="contenido"]', form_e).val(res.data.contenido);
        $('[name="tipo"]', form_e).val(res.data.tipo);

        form_a.closest('.card').fadeOut();
        form_e.closest('.card').fadeIn();

      } else {
        toastr.error(res.msg, '¡Upss!');
      }
    }).fail(function(err) {
      toastr.error('Hubo un error en la petición', '¡Upss!');
    }).always(function() {
      $('body').waitMe('hide');
    })
  }

  // Cancelar edición de lección
  $('.cancelar_update_leccion').on('click', cancelar_update_leccion);
  function cancelar_update_leccion(e) {
    e.preventDefault();

    var button = $(this),
    form_a     = $('#add_leccion_form'),
    form_e     = $('#update_leccion_form');

    form_e.trigger('reset');
    form_e.closest('.card').fadeOut();
    form_a.closest('.card').fadeIn();
    return true;
  }

  // Guardar cambios de lección
  $('#update_leccion_form').on('submit', update_leccion_form);
  function update_leccion_form(e) {
    e.preventDefault();

    var form = $(this),
    form_a   = $('#add_leccion_form'),
    data     = new FormData(form.get(0));

    if (!confirm('¿Estás seguro?')) return;
    
    // AJAX
    $.ajax({
      url: 'ajax/update_leccion_form',
      type: 'post',
      dataType: 'json',
      contentType: false,
      processData: false,
      cache: false,
      data : data,
      beforeSend: function() {
        form.waitMe();
      }
    }).done(function(res) {
      if(res.status === 200) {
        toastr.success(res.msg, '¡Bien!');
        get_lecciones();
        form.closest('.card').fadeOut();
        form.trigger('reset');
        form_a.closest('.card').fadeIn();

      } else {
        toastr.error(res.msg, '¡Upss!');
      }
    }).fail(function(err) {
      toastr.error('Hubo un error en la petición', '¡Upss!');
    }).always(function() {
      form.waitMe('hide');
    })
  }

  $('body').on('click', '.update_leccion_status', update_leccion_status);  
  function update_leccion_status(e) {
    e.preventDefault();

    var button = $(this),
    id         = button.data('id'),
    action     = 'put',
    csrf     = Bee.csrf;

    if (!confirm('¿Estás seguro?')) return;
    
    // AJAX
    $.ajax({
      url: 'ajax/update_leccion_status',
      type: 'post',
      dataType: 'json',
      cache: false,
      data : {action, csrf, id},
      beforeSend: function() {
        button.closest('.group').waitMe();
      }
    }).done(function(res) {
      if(res.status === 200) {
        toastr.success(res.msg, '¡Bien!');

        if (res.data.status === 'pendiente') {
          button.removeClass('btn-success').addClass('btn-warning text-dark');
        } else {
          button.removeClass('btn-warning text-dark').addClass('btn-success');
        }

      } else {
        toastr.error(res.msg, '¡Upss!');
      }
    }).fail(function(err) {
      toastr.error('Hubo un error en la petición', '¡Upss!');
    }).always(function() {
      button.closest('.group').waitMe('hide');
    })
  }