
const formulario = document.getElementById("formulario-grua");

if (formulario) {
    const campoUbicacion = document.getElementById("ubicacion-grua");
    const campoVehiculo = document.getElementById("vehiculo-grua");
    const campoDestino = document.getElementById("destino-grua");
    const campoDetalles = document.getElementById("detalles-grua");

    // Elementos existentes en el HTML
    const botonUbicacion = document.getElementById("obtener-ubicacion");
    const estadoUbicacion = document.getElementById("estado-ubicacion");
    const campoLatitud = document.getElementById("latitud-grua");
    const campoLongitud = document.getElementById("longitud-grua");

    const telefono = "573229327251";

    let enlaceMapa = "";
    let ubicacionGpsObtenida = false;

    // Obtener la ubicación actual una sola vez.
    if (botonUbicacion && campoUbicacion && estadoUbicacion) {
        botonUbicacion.addEventListener("click", () => {
            if (!navigator.geolocation) {
                estadoUbicacion.textContent =
                    "Tu navegador no permite obtener la ubicación. Escríbela manualmente.";
                return;
            }

            botonUbicacion.disabled = true;
            estadoUbicacion.textContent = "Obteniendo ubicación...";

            navigator.geolocation.getCurrentPosition(
                (posicion) => {
                    const { latitude, longitude, accuracy } = posicion.coords;

                    // Guardar las coordenadas
                    campoLatitud.value = latitude;
                    campoLongitud.value = longitude;

                    // Crear enlace de Google Maps
                    enlaceMapa =
                        `https://www.google.com/maps?q=${latitude},${longitude}`;

                    // Mostrar la ubicación en el formulario
                    campoUbicacion.value =
                        `Ubicación GPS (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;

                    ubicacionGpsObtenida = true;

                    estadoUbicacion.textContent =
                        `Ubicación obtenida. Precisión aproximada: ${Math.round(accuracy)} metros.`;

                    botonUbicacion.disabled = false;
                },
                (error) => {
                    const mensajes = {
                        1: "No concediste permiso para acceder a la ubicación.",
                        2: "No fue posible determinar la ubicación. Inténtalo de nuevo.",
                        3: "La solicitud tardó demasiado. Inténtalo de nuevo."
                    };

                    estadoUbicacion.textContent =
                        mensajes[error.code] ||
                        "No se pudo obtener la ubicación. Escríbela manualmente.";

                    botonUbicacion.disabled = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        });

        // Si el cliente edita la dirección, dejar de usar el GPS anterior.
        campoUbicacion.addEventListener("input", () => {
            if (ubicacionGpsObtenida) {
                ubicacionGpsObtenida = false;
                enlaceMapa = "";

                if (campoLatitud) campoLatitud.value = "";
                if (campoLongitud) campoLongitud.value = "";

                estadoUbicacion.textContent =
                    "Dirección manual. La ubicación GPS anterior se ha eliminado.";
            }
        });
    }

    // Preparar la solicitud para WhatsApp.
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        const ubicacion = campoUbicacion?.value.trim() || "";
        const vehiculo = campoVehiculo?.value.trim() || "";
        const destino = campoDestino?.value.trim() || "";
        const detalles = campoDetalles?.value.trim() || "";

        if (!ubicacion || !vehiculo) {
            formulario.reportValidity();
            return;
        }

        const mensaje = [
            "Hola, Grúas Emanuel. Necesito solicitar un servicio de grúa.",
            "",
            `Ubicación actual: ${ubicacion}`,
            enlaceMapa && ubicacionGpsObtenida
                ? `Ver ubicación en Google Maps: ${enlaceMapa}`
                : "",
            `Tipo de vehículo: ${vehiculo}`,
            `Destino: ${destino || "Por definir"}`,
            `Detalles: ${detalles || "No especificados"}`
        ].filter(Boolean).join("\n");

        const urlWhatsApp =
            `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

        window.location.href = urlWhatsApp;
    });
}