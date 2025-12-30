const listaTareas = document.querySelector('#lista-tareas');
const listaCompletadas = document.querySelector('#tareas-check');
const formulario = document.querySelector('#formulario');
let tareas = [];

eventListeners();

function eventListeners() {
     formulario.addEventListener('submit', agregarTarea);

     document.addEventListener('DOMContentLoaded', () => {
          tareas = JSON.parse( localStorage.getItem('tareas') ) || [];
          crearHTML();
     });
}

function agregarTarea(e) {
     e.preventDefault();
     const tarea = document.querySelector('#tarea').value;
     
     if(tarea === '') {
          mostrarError('Una tarea no puede estar vacía');
          return;
     }

     const tareaObj = {
          id: Date.now(),
          texto: tarea,
          completada: false
     }

     tareas = [...tareas, tareaObj];
     crearHTML();
     formulario.reset();
}

function mostrarError(error) {
     const mensajeEerror = document.createElement('p');
     mensajeEerror.textContent = error;
     mensajeEerror.classList.add('error');

     const contenedorForm = document.querySelector('.tareas');
     contenedorForm.appendChild(mensajeEerror);

     setTimeout(() => {
          mensajeEerror.remove();
     }, 3000);
}

function crearHTML() {
     limpiarHTML();
     
     if(tareas.length > 0 ) {
          tareas.forEach( tarea =>  {
               // 1. Crear elementos base
               const li = document.createElement('li');
               li.innerText = tarea.texto;

               const hr = document.createElement('hr');
               hr.classList.add('hr-divisor'); // Inyectamos la clase acá

               // 2. Crear botón borrar (común a ambos)
               const botonBorrar = document.createElement('a');
               botonBorrar.classList = 'borrar-tarea';
               botonBorrar.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
               botonBorrar.onclick = (e) => {
                    e.stopPropagation();
                    borrarTarea(tarea.id);
               };

               // 3. Lógica según estado
               if(tarea.completada) {
                    li.classList.add('tarea-completada');
                    li.style.textDecoration = "line-through";
                    li.appendChild(botonBorrar);
                    
                    listaCompletadas.appendChild(li);
                    listaCompletadas.appendChild(hr); // Se inyecta con la clase
               } else {
                    const botonCheck = document.createElement('a');
                    botonCheck.classList = 'check-tarea';
                    botonCheck.innerHTML = `<i class="fa-solid fa-check"></i>`;
                    botonCheck.style.color = "green";
                    botonCheck.style.cursor = "pointer";
                    botonCheck.style.marginRight = "10px";
                    
                    botonCheck.onclick = (e) => {
                         e.stopPropagation();
                         completarTarea(tarea.id);
                    };

                    li.appendChild(botonCheck);
                    li.appendChild(botonBorrar);
                    
                    listaTareas.appendChild(li);
                    listaTareas.appendChild(hr); // Se inyecta con la clase
               }
          });
     }
     sincronizarStorage();
}

function completarTarea(id) {
     tareas = tareas.map( tarea => {
          if(tarea.id === id) {
               return { ...tarea, completada: true }
          }
          return tarea;
     });
     crearHTML();
}

function borrarTarea(id) {
     tareas = tareas.filter( tarea => tarea.id !== id );
     crearHTML();
}

function sincronizarStorage() {
     localStorage.setItem('tareas', JSON.stringify(tareas));
}

function limpiarHTML() {
     while(listaTareas.firstChild) {
          listaTareas.removeChild(listaTareas.firstChild);
     }
     while(listaCompletadas.firstChild) {
          listaCompletadas.removeChild(listaCompletadas.firstChild);
     }
}