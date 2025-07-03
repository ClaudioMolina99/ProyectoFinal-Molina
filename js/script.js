const precios = {
  "Muay Thai": { "2": 15000, "3": 20000, "5": 25000 },
  "Karate": { "2": 13000, "3": 17000, "5": 22000 },
  "Jiu-Jitsu": { "2": 14000, "3": 18000, "5": 23000 }
};

document.getElementById("formulario-inscripcion").addEventListener("submit", function (e) {
  e.preventDefault();

  const disciplina = document.getElementById("disciplina").value;
  const dias = document.getElementById("dias").value;
  const turno = document.getElementById("turno").value;

  if (disciplina && dias && turno) {
    const precio = precios[disciplina][dias];

    document.getElementById("resultado").innerHTML = `
      <h3>Resumen de inscripción</h3>
      <p>Disciplina: <strong>${disciplina}</strong></p>
      <p>Días por semana: <strong>${dias}</strong></p>
      <p>Turno: <strong>${turno}</strong></p>
      <p>Precio mensual: <strong>$${precio}</strong></p>
    `;

    const inscripcion = {
      disciplina: disciplina,
      dias: dias,
      turno: turno,
      precio: precio
    };

    localStorage.setItem("ultimaInscripcion", JSON.stringify(inscripcion));
  }
});
