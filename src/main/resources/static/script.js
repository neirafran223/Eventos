document.addEventListener("DOMContentLoaded", () => {
  const formEvento = document.getElementById("formEvento");
  const listaEventos = document.getElementById("eventosList");
  const detalleEvento = document.getElementById("detalleEvento");
  const detalleContenido = document.getElementById("detalleContenido");
  const toggleBtn = document.getElementById("toggleEventosBtn");
  const loader = document.getElementById("loader");

  let visible = false;

  function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  function obtenerEventos() {
    fetch("http://localhost:8080/api/v1/evento")
      .then((res) => res.json())
      .then((eventos) => {
        listaEventos.innerHTML = "";
        eventos.forEach((evento) => {
          const li = document.createElement("li");
          li.innerHTML = `
              <h3>${evento.nombre}</h3>
              <p>${evento.ubicacion} | ${formatearFecha(evento.fecha)}</p>
              <button onclick="verDetalle(${evento.id})">Ver Detalle</button>
            `;
          listaEventos.appendChild(li);
        });
      });
  }

  window.verDetalle = function (id) {
    fetch(`http://localhost:8080/api/v1/evento/${id}`)
      .then((res) => res.json())
      .then((evento) => {
        detalleEvento.style.display = "block";
        listaEventos.style.display = "none";
        detalleContenido.innerHTML = `
            <h3>${evento.nombre}</h3>
            <p>Ubicación: ${evento.ubicacion}</p>
            <p>Fecha: ${formatearFecha(evento.fecha)}</p>
            <p>Cantidad de personas: ${evento.cantPersonas}</p>
            <p>Cantidad de seguridad: ${evento.cantSeguridad}</p>
            <p>Tipo de evento: ${evento.tipoEvento}</p>
          `;
      });
  };

  window.volver = function () {
    detalleEvento.style.display = "none";
    listaEventos.style.display = visible ? "block" : "none";
  };

  toggleBtn.addEventListener("click", () => {
    visible = !visible;
    listaEventos.style.display = visible ? "block" : "none";
    toggleBtn.innerText = visible ? "Ocultar Eventos" : "Mostrar Eventos";
    if (visible) obtenerEventos();
  });

  formEvento.addEventListener("submit", (event) => {
    event.preventDefault();
    loader.style.display = "block";

    const nuevoEvento = {
      nombre: document.getElementById("nombre").value,
      ubicacion: document.getElementById("ubicacion").value,
      fecha: document.getElementById("fecha").value,
      cantPersonas: document.getElementById("cantPersonas").value,
      cantSeguridad: document.getElementById("cantSeguridad").value,
      tipoEvento: document.getElementById("tipoEvento").value,
    };

    fetch("http://localhost:8080/api/v1/evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoEvento),
    })
      .then((res) => res.json())
      .then(() => {
        loader.style.display = "none";
        formEvento.reset();
        if (visible) obtenerEventos();
      })
      .catch((err) => {
        loader.style.display = "none";
        console.error("Error al crear evento:", err);
      });
  });
});
