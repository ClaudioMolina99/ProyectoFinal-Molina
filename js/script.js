let packs = [];

// Cargar los packs desde datos.json
fetch("../datos.json")
  .then(response => response.json())
  .then(data => {
    packs = data;
    mostrarPacks(packs);
  })
  .catch(error => {
    console.error("Error al cargar los packs:", error);
  });

// Mostrar packs en pantalla
function mostrarPacks(packs) {
  const contenedor = document.getElementById("contenedorPacks");
  contenedor.innerHTML = "";

  packs.forEach(pack => {
    const div = document.createElement("div");
    div.classList.add("pack");
    div.innerHTML = `
      <h3>${pack.nombre}</h3>
      <p>Clases: ${pack.clases}</p>
      <p>Precio: $${pack.precio}</p>
      <button onclick="seleccionarPack(${pack.id})">Seleccionar</button>
    `;
    contenedor.appendChild(div);
  });
}

// Confirmar selección con SweetAlert2
function seleccionarPack(id) {
  const packElegido = packs.find(p => p.id === id);

  Swal.fire({
    title: `¿Confirmás el ${packElegido.nombre}?`,
    text: `Total a pagar: $${packElegido.precio}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      guardarInscripcion(packElegido);
      Swal.fire('¡Inscripción guardada!', '', 'success');
    }
  });
}

// Guardar inscripción en localStorage
function guardarInscripcion(pack) {
  let inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
  inscripciones.push(pack);
  localStorage.setItem("inscripciones", JSON.stringify(inscripciones));
}
