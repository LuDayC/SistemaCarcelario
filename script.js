//RECLUSOS.HTML
document.addEventListener('DOMContentLoaded', function() {
    mostrarReclusos();

    // Agregar un nuevo recluso
    document.getElementById('formReclusos').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obtener los datos del formulario
        let nombre = document.getElementById('nombre').value;
        let id = document.getElementById('id').value;
        let delito = document.getElementById('delito').value;
        let condena = document.getElementById('condena').value;
        let fechaIngreso = document.getElementById('fechaIngreso').value;
        
        let recluso = { nombre, id, delito, condena, fechaIngreso };
        
        // Obtener los reclusos actuales del localStorage
        let reclusos = JSON.parse(localStorage.getItem('reclusos')) || [];
        
        // Agregar el nuevo recluso
        reclusos.push(recluso);
        localStorage.setItem('reclusos', JSON.stringify(reclusos));

        // Actualizar la lista de reclusos en pantalla
        mostrarReclusos();

        // Limpiar el formulario
        document.getElementById('formReclusos').reset();

        // Cerrar el modal
        let modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregar'));
        modal.hide();
    });
    
    // Mostrar reclusos en forma de cards
    function mostrarReclusos() {
        let reclusos = JSON.parse(localStorage.getItem('reclusos')) || [];
        let listaReclusos = document.getElementById('listaReclusos');
        listaReclusos.innerHTML = '';

        reclusos.forEach((recluso, index) => {
            let reclusoCard = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${recluso.nombre}</h5>
                            <p class="card-text"><strong>ID:</strong> ${recluso.id}</p>
                            <p class="card-text"><strong>Delito:</strong> ${recluso.delito}</p>
                            <p class="card-text"><strong>Condena:</strong> ${recluso.condena} años</p>
                            <p class="card-text"><strong>Fecha de Ingreso:</strong> ${recluso.fechaIngreso}</p>
                            <button class="btn btn-warning" onclick="editarRecluso(${index})" data-bs-toggle="modal" data-bs-target="#modalEditar">Editar</button>
                            <button class="btn btn-danger" onclick="eliminarRecluso(${index})" data-bs-toggle="modal" data-bs-target="#modalEliminar">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            listaReclusos.innerHTML += reclusoCard;
        });
    }

    // Editar recluso
    window.editarRecluso = function(index) {
        let reclusos = JSON.parse(localStorage.getItem('reclusos'));
        let recluso = reclusos[index];

        document.getElementById('editNombre').value = recluso.nombre;
        document.getElementById('editId').value = recluso.id;
        document.getElementById('editDelito').value = recluso.delito;
        document.getElementById('editCondena').value = recluso.condena;
        document.getElementById('editFechaIngreso').value = recluso.fechaIngreso;

        document.getElementById('formEditarRecluso').onsubmit = function(event) {
            event.preventDefault();
            
            recluso.nombre = document.getElementById('editNombre').value;
            recluso.id = document.getElementById('editId').value;
            recluso.delito = document.getElementById('editDelito').value;
            recluso.condena = document.getElementById('editCondena').value;
            recluso.fechaIngreso = document.getElementById('editFechaIngreso').value;

            reclusos[index] = recluso;
            localStorage.setItem('reclusos', JSON.stringify(reclusos));
            mostrarReclusos();

            let modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
            modal.hide();
        };
    };

    // Eliminar recluso
    window.eliminarRecluso = function(index) {
        document.getElementById('btnConfirmarEliminar').onclick = function() {
            let reclusos = JSON.parse(localStorage.getItem('reclusos'));
            reclusos.splice(index, 1);
            localStorage.setItem('reclusos', JSON.stringify(reclusos));
            mostrarReclusos();

            let modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminar'));
            modal.hide();
        };
    };
});


//VISITAS.HTML
document.addEventListener('DOMContentLoaded', () => {
    let reclusos = JSON.parse(localStorage.getItem('reclusos')) || [];
    let visitas = JSON.parse(localStorage.getItem('visitas')) || {};
    const listaReclusos = document.getElementById('listaReclusos');
    let reclusoSeleccionado = null;  // Índice del recluso seleccionado para agregar visitas

    // Actualizar la lista de reclusos como cards
    function actualizarListaReclusos() {
        listaReclusos.innerHTML = '';
        reclusos.forEach((recluso, index) => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4');
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${recluso.nombre}</h5>
                        <p class="card-text">ID: ${recluso.id}</p>
                        <p class="card-text">Delito: ${recluso.delito}</p>
                        <p class="card-text">Condena: ${recluso.condena} años</p>
                        <p class="card-text">Fecha de Ingreso: ${recluso.fechaIngreso}</p>
                        <button class="btn btn-dark btnVisita" data-index="${index}" data-bs-toggle="modal" data-bs-target="#modalAgregarVisita">Agregar Visita</button>
                        <button class="btn btn-danger btnHistorial" data-index="${index}" data-bs-toggle="modal" data-bs-target="#modalHistorialVisitas">Ver Historial</button>
                    </div>
                </div>
            `;
            listaReclusos.appendChild(card);
        });

        // Añadir eventos a los botones de visitas y de historial
        document.querySelectorAll('.btnVisita').forEach(button => {
            button.addEventListener('click', (event) => {
                reclusoSeleccionado = event.target.getAttribute('data-index');
            });
        });

        document.querySelectorAll('.btnHistorial').forEach(button => {
            button.addEventListener('click', (event) => {
                reclusoSeleccionado = event.target.getAttribute('data-index');
                mostrarHistorialVisitas(reclusoSeleccionado);
            });
        });
    }

    // Añadir una visita
    document.getElementById('formVisitas').addEventListener('submit', (event) => {
        event.preventDefault();
        const nombreVisitante = document.getElementById('nombreVisitante').value;
        const fechaVisita = document.getElementById('fechaVisita').value;

        if (!visitas[reclusoSeleccionado]) {
            visitas[reclusoSeleccionado] = [];
        }
        
        visitas[reclusoSeleccionado].push({
            nombreVisitante,
            fechaVisita
        });

        localStorage.setItem('visitas', JSON.stringify(visitas));
        document.getElementById('formVisitas').reset();
        bootstrap.Modal.getInstance(document.getElementById('modalAgregarVisita')).hide();  // Cerrar modal
    });

    // Mostrar el historial de visitas
    function mostrarHistorialVisitas(index) {
        const listaHistorialVisitas = document.getElementById('listaHistorialVisitas');
        listaHistorialVisitas.innerHTML = '';  // Limpiar la lista

        const historial = visitas[index] || [];
        
        historial.forEach((visita) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = `Visitante: ${visita.nombreVisitante} - Fecha: ${visita.fechaVisita}`;
            listaHistorialVisitas.appendChild(li);
        });
    }

    // Cargar lista de reclusos al cargar la página
    actualizarListaReclusos();
});


    
// PERSONAL.HTML
document.addEventListener('DOMContentLoaded', function () {
    mostrarPersonal();

    // Filtrar personal por tipo (Médico, Psicólogo, Guardia)
    window.filtrarPersonal = function (rol) {
        document.getElementById('tituloPersonal').textContent = `${rol}s`;
        let personal = JSON.parse(localStorage.getItem('personal')) || [];
        let personalFiltrado = personal.filter(p => p.rol === rol);
        mostrarPersonalEnCards(personalFiltrado);
    };

    // Añadir personal
    document.getElementById('formPersonal').addEventListener('submit', function (event) {
        event.preventDefault();
        let nombre = document.getElementById('nombrePersonal').value;
        let genero = document.getElementById('generoPersonal').value;
        let rol = document.getElementById('rolPersonal').value;

        let personal = JSON.parse(localStorage.getItem('personal')) || [];
        personal.push({ nombre, genero, rol });
        localStorage.setItem('personal', JSON.stringify(personal));
        mostrarPersonal();
        let modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregar'));
        modal.hide();
    });

    // Mostrar personal en formato de cards
    function mostrarPersonalEnCards(personal) {
        let listaPersonal = document.getElementById('listaPersonal');
        listaPersonal.innerHTML = '';

        personal.forEach((persona, index) => {
            let card = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${persona.nombre}</h5>
                            <p class="card-text"><strong>Género:</strong> ${persona.genero}</p>
                            <p class="card-text"><strong>Rol:</strong> ${persona.rol}</p>
                            <button class="btn btn-warning" onclick="editarPersonal(${index})" data-bs-toggle="modal" data-bs-target="#modalEditar">Editar</button>
                            <button class="btn btn-danger" onclick="eliminarPersonal(${index})" data-bs-toggle="modal" data-bs-target="#modalEliminar">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            listaPersonal.innerHTML += card;
        });
    }

    // Editar personal
    window.editarPersonal = function (index) {
        let personal = JSON.parse(localStorage.getItem('personal'));
        let persona = personal[index];

        document.getElementById('editNombrePersonal').value = persona.nombre;
        document.getElementById('editGeneroPersonal').value = persona.genero;
        document.getElementById('editRolPersonal').value = persona.rol;

        document.getElementById('formEditarPersonal').onsubmit = function (event) {
            event.preventDefault();
            persona.nombre = document.getElementById('editNombrePersonal').value;
            persona.genero = document.getElementById('editGeneroPersonal').value;
            persona.rol = document.getElementById('editRolPersonal').value;

            personal[index] = persona;
            localStorage.setItem('personal', JSON.stringify(personal));
            mostrarPersonal();
            let modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
            modal.hide();
        };
    };

    // Eliminar personal
    window.eliminarPersonal = function (index) {
        document.getElementById('btnConfirmarEliminar').onclick = function () {
            let personal = JSON.parse(localStorage.getItem('personal'));
            personal.splice(index, 1);
            localStorage.setItem('personal', JSON.stringify(personal));
            mostrarPersonal();
            let modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminar'));
            modal.hide();
        };
    };

    // Mostrar todo el personal al cargar
    function mostrarPersonal() {
        let personal = JSON.parse(localStorage.getItem('personal')) || [];
        mostrarPersonalEnCards(personal);
    }
});




//REPORTES.HTML
document.addEventListener('DOMContentLoaded', function () {
    mostrarReportes();

    // Añadir nuevo reporte
    document.getElementById('formReportes').addEventListener('submit', function (event) {
        event.preventDefault();
        let tipo = document.getElementById('tipoReporte').value;
        let fecha = document.getElementById('fechaReporte').value;
        let descripcion = document.getElementById('descripcion').value;

        let reportes = JSON.parse(localStorage.getItem('reportes')) || [];
        reportes.push({ tipo, fecha, descripcion });
        localStorage.setItem('reportes', JSON.stringify(reportes));
        mostrarReportes();

        let modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarReporte'));
        modal.hide();
    });

    // Mostrar reportes en formato de tarjetas
    function mostrarReportes(filtroTipo = "", filtroFecha = "") {
        let reportes = JSON.parse(localStorage.getItem('reportes')) || [];
        let listaReportes = document.getElementById('listaReportes');
        listaReportes.innerHTML = '';

        reportes = reportes.filter((reporte) => {
            return (filtroTipo === "" || reporte.tipo.toLowerCase().includes(filtroTipo.toLowerCase())) &&
                   (filtroFecha === "" || reporte.fecha === filtroFecha);
        });

        reportes.forEach((reporte, index) => {
            let card = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${reporte.tipo}</h5>
                            <p class="card-text"><strong>Fecha:</strong> ${reporte.fecha}</p>
                            <p class="card-text"><strong>Descripción:</strong> ${reporte.descripcion}</p>
                            <button class="btn btn-danger" onclick="eliminarReporte(${index})" data-bs-toggle="modal" data-bs-target="#modalEliminarReporte">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            listaReportes.innerHTML += card;
        });
    }

    // Eliminar reporte
    window.eliminarReporte = function (index) {
        document.getElementById('btnConfirmarEliminar').onclick = function () {
            let reportes = JSON.parse(localStorage.getItem('reportes'));
            reportes.splice(index, 1);
            localStorage.setItem('reportes', JSON.stringify(reportes));
            mostrarReportes();
            let modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminarReporte'));
            modal.hide();
        };
    };

    // Filtro por tipo de actividad
    document.getElementById('buscadorTipoActividad').addEventListener('input', function () {
        let filtroTipo = this.value;
        let filtroFecha = document.getElementById('filtroFecha').value;
        mostrarReportes(filtroTipo, filtroFecha);
    });

    // Filtro por fecha
    document.getElementById('filtroFecha').addEventListener('change', function () {
        let filtroTipo = document.getElementById('buscadorTipoActividad').value;
        let filtroFecha = this.value;
        mostrarReportes(filtroTipo, filtroFecha);
    });
});
