document.addEventListener("DOMContentLoaded", () => {
  const formEvento = document.getElementById("formEvento");
  const listaEventos = document.getElementById("eventosList");
  const detalleEvento = document.getElementById("detalleEvento");
  const detalleContenido = document.getElementById("detalleContenido");
  const toggleBtn = document.getElementById("toggleEventosBtn");
  const eliminarBtn = document.getElementById("eliminar");
  const loader = document.getElementById("loader");

  let visible = false;
  let eventoActualId = null; // Variable para almacenar el ID del evento que se está viendo

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
      })
      .catch((err) => {
        console.error("Error al obtener eventos:", err);
      });
  }

  window.verDetalle = function (id) {
    eventoActualId = id; // Guardamos el ID del evento actual
    fetch(`http://localhost:8080/api/v1/evento/${id}`)
      .then((res) => res.json())
      .then((evento) => {
        detalleEvento.style.display = "block";
        listaEventos.style.display = "none";
        detalleContenido.innerHTML = `
            <h3>${evento.nombre}</h3>
            <p><strong>Ubicación:</strong> ${evento.ubicacion}</p>
            <p><strong>Fecha:</strong> ${formatearFecha(evento.fecha)}</p>
            <p><strong>Cantidad de personas:</strong> ${evento.cantPersonas}</p>
            <p><strong>Cantidad de seguridad:</strong> ${evento.cantSeguridad}</p>
            <p><strong>Tipo de evento:</strong> ${evento.tipoEvento}</p>
          `;
      })
      .catch((err) => {
        console.error("Error al obtener detalles del evento:", err);
      });
  };

  // Función para eliminar evento
  eliminarBtn.addEventListener("click", () => {
    if (!eventoActualId) return;
    
    if (!confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      return;
    }

    loader.style.display = "block";
    
    fetch(`http://localhost:8080/api/v1/evento/${eventoActualId}`, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al eliminar el evento");
      }
      return response.json();
    })
    .then(() => {
      loader.style.display = "none";
      alert("Evento eliminado correctamente");
      volver(); // Regresar a la lista
      if (visible) obtenerEventos(); // Actualizar lista si está visible
    })
    .catch(error => {
      loader.style.display = "none";
      console.error("Error:", error);
      alert("Ocurrió un error al eliminar el evento");
    });
  });

  window.volver = function () {
    eventoActualId = null; // Limpiamos el ID del evento actual
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
        alert("Ocurrió un error al crear el evento");
      });
  });
});