import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("todos");
  const [buscar, setBuscar] = useState("");
  const [vista, setVista] = useState("inicio");
  const [config, setConfig] = useState(null);

  // 🔹 OBTENER PRODUCTOS (MENÚ)
  const obtenerProductos = () => {
    let url = "http://127.0.0.1:8000/api/productos/?";

    if (categoria !== "todos") {
      url += `categoria=${categoria}&`;
    }

    if (buscar) {
      url += `buscar=${buscar}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setProductos(data));
  };

  // 🔹 CONTROL DE VISTA
  useEffect(() => {
    if (vista === "menu") {
      obtenerProductos();
    } 
    
    else if (vista === "inicio") {
      // 🔥 PRODUCTOS DESTACADOS
      fetch("http://127.0.0.1:8000/api/destacados/")
        .then(res => res.json())
        .then(data => setProductos(data));

      // 🔥 CONFIGURACIÓN (MAPA + HORARIOS)
      fetch("http://127.0.0.1:8000/api/configuracion/")
        .then(res => res.json())
        .then(data => setConfig(data));
    }

  }, [categoria, buscar, vista]);

  return (
    <div className="container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Cafetería</h2>
        <ul>
          <li onClick={() => setVista("inicio")}>Inicio</li>
          <li onClick={() => setVista("menu")}>Menú</li>
        </ul>
      </div>

      {/* CONTENIDO */}
      <div className="content">

        {/* 🔹 INICIO */}
        {vista === "inicio" && (
          <>
            <h1>Bienvenido</h1>

            <h2>Productos Destacados</h2>

            <div className="grid">
              {productos.map((p) => (
                <div className="card" key={p.id}>
                  
                  <img
                    src={
                      p.imagen
                        ? `http://127.0.0.1:8000${p.imagen}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={p.nombre}
                    className="imagen"
                  />

                  <h3>{p.nombre}</h3>
                  <p>{p.descripcion}</p>

                  {/* 🔥 ETIQUETAS */}
                  <div className="etiquetas">
                    {p.etiquetas &&
                      p.etiquetas.map((et) => (
                        <span key={et.id} className="tag">
                          {et.nombre}
                        </span>
                      ))}
                  </div>

                  <span>Bs. {p.precio}</span>
                </div>
              ))}
            </div>

            {/* 🔥 ENCUÉNTRANOS DEBAJO */}
            {config && (
              <div className="mapa-section">
                <h2>Encuéntranos</h2>

                <h3>{config.nombre}</h3>
                <p><strong>Dirección:</strong> {config.direccion}</p>

                <h4>Horarios</h4>
                <p>Lunes a Viernes: {config.horario_lunes_viernes}</p>
                <p>Sábado: {config.horario_sabado}</p>
                <p>Domingo: {config.horario_domingo}</p>

                {/* 🗺️ MAPA */}
                <div className="mapa">
                  <iframe
                    title="mapa"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${config.latitud},${config.longitud}&z=15&output=embed`}
                  ></iframe>
                </div>

                {/* 🔥 BOTÓN GOOGLE MAPS */}
                <a
                  href={`https://www.google.com/maps?q=${config.latitud},${config.longitud}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-maps"
                >
                  Cómo llegar
                </a>
              </div>
            )}
          </>
        )}

        {/* 🔹 MENÚ */}
        {vista === "menu" && (
          <>
            <h1>Nuestro Menú</h1>

            <input
              className="search"
              type="text"
              placeholder="Buscar..."
              onChange={(e) => setBuscar(e.target.value)}
            />

            <div className="buttons">
              <button onClick={() => setCategoria("todos")}>Todos</button>
              <button onClick={() => setCategoria("bebida")}>Bebidas</button>
              <button onClick={() => setCategoria("comida")}>Comida</button>
              <button onClick={() => setCategoria("te")}>Té</button>
            </div>

            <div className="grid">
              {productos.map((p) => (
                <div className="card" key={p.id}>
                  
                  <img
                    src={
                      p.imagen
                        ? `http://127.0.0.1:8000${p.imagen}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={p.nombre}
                    className="imagen"
                  />

                  <h3>{p.nombre}</h3>
                  <p>{p.descripcion}</p>

                  <div className="etiquetas">
                    {p.etiquetas &&
                      p.etiquetas.map((et) => (
                        <span key={et.id} className="tag">
                          {et.nombre}
                        </span>
                      ))}
                  </div>

                  <span>Bs. {p.precio}</span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default App;