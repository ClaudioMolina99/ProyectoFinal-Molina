let packs = [];

// ====== Cargar datos desde datos.json ======
fetch("datos.json")
  .then(response => response.json())
  .then(data => {
    packs = data;
    mostrarPacks(packs);
    llenarSelect(packs); // llenar el <select> del formulario
  })
  .catch(error => {
    console.error("Error al cargar los packs:", error);
  });

// ====== Utilidad: mensajes bajo el formulario (verde/rojo) ======
function mostrarMensaje(texto, tipo) {
  const divMsg = document.getElementById("mensaje");
  if (!divMsg) return;
  divMsg.textContent = texto;
  divMsg.style.display = "block";
  divMsg.className = (tipo === "ok") ? "msg-ok" : "msg-error";
}

// ====== Render de packs en pantalla ======
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

// ====== Llenar el <select> del formulario con los packs ======
function llenarSelect(packs) {
  const select = document.getElementById("selectClase");
  if (!select) return;

  // Opción Inicial
  select.innerHTML = '<option value="">Elegí una opción…</option>';

  packs.forEach(pack => {
    const option = document.createElement("option");
    option.value = pack.id;
    option.textContent = `${pack.nombre} - $${pack.precio}`;
    select.appendChild(option);
  });
}

// ====== Formulario de inscripción ======
const form = document.getElementById("formInscripcion");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const idPack = document.getElementById("selectClase").value;

    // Validaciones
    if (nombre.length < 3) {
      return mostrarMensaje("El nombre debe tener al menos 3 caracteres.", "error");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return mostrarMensaje("Ingresá un email válido.", "error");
    }
    if (!/^[0-9]{8,15}$/.test(telefono)) {
      return mostrarMensaje("El teléfono debe tener entre 8 y 15 dígitos (solo números).", "error");
    }
    if (!idPack) {
      return mostrarMensaje("Tenés que elegir un pack.", "error");
    }

    const packElegido = packs.find(p => p.id == idPack);

    // Confirmación final con un SweetAlert
    Swal.fire({
      title: "Confirmar inscripción",
      text: `Nombre: ${nombre}\nPack: ${packElegido.nombre}\nPrecio: $${packElegido.precio}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        guardarInscripcion({
          nombre,
          email,
          telefono,
          pack: packElegido,
          fecha: new Date().toISOString()
        });
        // Éxito: Swal + mensaje verde bajo el formulario
        Swal.fire("¡Inscripción registrada!", "Tus datos se guardaron correctamente.", "success");
        mostrarMensaje(`¡Listo, ${nombre}! Te inscribiste en ${packElegido.nombre} por $${packElegido.precio}.`, "ok");
        form.reset(); // limpiar el formulario
      }
    });
  });
}

// ====== Guardar inscripción en localStorage ======
function guardarInscripcion(inscripcion) {
  let inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
  inscripciones.push(inscripcion);
  localStorage.setItem("inscripciones", JSON.stringify(inscripciones));
}

// ====== Botón "Seleccionar" en cada tarjeta  ======
function seleccionarPack(id) {
  const packElegido = packs.find(p => p.id === id);
  Swal.fire({
    title: `¿Querés inscribirte al ${packElegido.nombre}?`,
    text: `Precio: $${packElegido.precio}. Usá el formulario de abajo para completar tus datos.`,
    icon: "info"
  });
}
