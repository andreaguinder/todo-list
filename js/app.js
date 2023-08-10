// Variables
const listaTareas = document.querySelector('#lista-tareas');
const formulario = document.querySelector('#formulario');
let tareas = [];

// Event Listeners
eventListeners();

function eventListeners() {
     //Cuando se envia el formulario
     formulario.addEventListener('submit', agregarTarea);

     // Borrar Tareas
     listaTareas.addEventListener('click', borrarTarea);

     // Contenido cargado
     document.addEventListener('DOMContentLoaded', () => {
          tareas = JSON.parse( localStorage.getItem('tareas') ) || []  ;
          console.log(tareas);
          crearHTML();
     });
}

// Añadir tarea del formulario
function agregarTarea(e) {
     e.preventDefault();
     // leer el valor del textarea
     const tarea = document.querySelector('#tarea').value;
     
     // validación
     if(tarea === '') {
          mostrarError('Una tarea no puede estar vacía');
          return;
     }

     // Crear un objeto Tarea
     const tareaObj = {
          id: Date.now(),
          texto: tarea
     }

     // Añadirlo a mis tareas
     tareas = [...tareas, tareaObj];
     
     // Una vez agregado, mandamos renderizar nuestro HTML
     crearHTML();

     // Reiniciar el formulario
     formulario.reset();
}

function mostrarError(error) {
     const mensajeEerror = document.createElement('p');
     mensajeEerror.textContent = error;
     mensajeEerror.classList.add('error');

     const contenido = document.querySelector('#contenido');
     contenido.appendChild(mensajeEerror);

     setTimeout(() => {
          mensajeEerror.remove();
     }, 3000);
}

function crearHTML() {
     limpiarHTML();
     
     if(tareas.length > 0 ) {
          tareas.forEach( tarea =>  {
               // crear boton de eliminar
               const botonBorrar = document.createElement('a');
               botonBorrar.classList = 'borrar-tarea';
               botonBorrar.innerText = 'X';
     
               // Crear elemento y añadirle el contenido a la lista
               const li = document.createElement('li');

               // Añade el texto
               li.innerText = tarea.texto;

               // añade el botón de borrar al tarea
               li.appendChild(botonBorrar);

               // añade un atributo único...
               li.dataset.tareaId = tarea.id;

               // añade el tarea a la lista
               listaTareas.appendChild(li);
          });
     }

     sincronizarStorage();
}

// Elimina el Tarea del DOM
function borrarTarea(e) {
     e.preventDefault();

     // console.log(e.target.parentElement.dataset.tareaId);
     const id = e.target.parentElement.dataset.tareaId;
     tareas = tareas.filter( tarea => tarea.id != id  );
     crearHTML();
}

// Agrega tarea a local storage
function sincronizarStorage() {
     localStorage.setItem('tareas', JSON.stringify(tareas));
}

// Elimina los cursos del carrito en el DOM
function limpiarHTML() {
     while(listaTareas.firstChild) {
          listaTareas.removeChild(listaTareas.firstChild);
     }
}