import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("todos");
  const [buscar, setBuscar] = useState("");
  const [vista, setVista] = useState("inicio");
  const [config, setConfig] = useState(null);

  // 🔥 GALERÍA
  const [galeria, setGaleria] = useState([]);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);

  // 🔐 LOGIN REAL
  const [usuario, setUsuario] = useState(null);

  // 🔹 PRODUCTOS
  const obtenerProductos = () => {
    let url = "http://127.0.0.1:8000/api/productos/?";

    if (categoria !== "todos") url += `categoria=${categoria}&`;
    if (buscar) url += `buscar=${buscar}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setProductos(data));
  };

  // 🔹 GALERÍA
  const obtenerGaleria = () => {
    fetch("http://127.0.0.1:8000/api/galeria/")
      .then(res => res.json())
      .then(data => setGaleria(data));
  };

  // 🔐 LOGIN REAL (BACKEND)
  const login = async () => {
    const username = prompt("Usuario");
    const password = prompt("Contraseña");

    const res = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      credentials: "include", // 🔥 clave
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login correcto");
      setUsuario(username);
    } else {
      alert("Error en login");
    }
  };

  // 🔥 PUBLICAR (CORREGIDO)
  const publicarPost = async () => {
    if (!usuario) {
      alert("Debes iniciar sesión");
      return;
    }

    const formData = new FormData();
    formData.append("descripcion", nuevaDescripcion);
    formData.append("imagen", imagen);

    const res = await fetch("http://127.0.0.1:8000/api/galeria/", {
      method: "POST",
      credentials: "include", // 🔥 clave
      body: formData
    });

    if (res.ok) {
      alert("Publicado");
      obtenerGaleria();
      setNuevaDescripcion("");
    } else {
      alert("Error al publicar");
    }
  };

  // 🔹 CONTROL
  useEffect(() => {
    if (vista === "menu") {
      obtenerProductos();
    } 
    else if (vista === "inicio") {
      fetch("http://127.0.0.1:8000/api/destacados/")
        .then(res => res.json())
        .then(data => setProductos(data));

      fetch("http://127.0.0.1:8000/api/configuracion/")
        .then(res => res.json())
        .then(data => setConfig(data));
    } 
    else if (vista === "galeria") {
      obtenerGaleria();
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
          <li onClick={() => setVista("galeria")}>Galería</li>
        </ul>
      </div>

      {/* CONTENIDO */}
      <div className="content">

        {/* 🔐 LOGIN */}
        <div className="topbar">
          {usuario ? (
            <span>👤 {usuario}</span>
          ) : (
            <button onClick={login}>
              Iniciar sesión
            </button>
          )}
        </div>

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
                  />
                  <h3>{p.nombre}</h3>
                  <p>{p.descripcion}</p>
                  <span>Bs. {p.precio}</span>
                </div>
              ))}
            </div>

            {config && (
              <div className="mapa-section">
                <h2>Encuéntranos</h2>
                <p>{config.direccion}</p>

                <iframe
                  title="mapa"
                  width="100%"
                  height="400"
                  src={`https://www.google.com/maps?q=${config.latitud},${config.longitud}&z=15&output=embed`}
                ></iframe>
              </div>
            )}
          </>
        )}

        {/* 🔹 MENÚ */}
        {vista === "menu" && (
          <>
            <h1>Menú</h1>

            <input
              placeholder="Buscar..."
              onChange={(e) => setBuscar(e.target.value)}
            />

            <div>
              <button onClick={() => setCategoria("todos")}>Todos</button>
              <button onClick={() => setCategoria("bebida")}>Bebidas</button>
              <button onClick={() => setCategoria("comida")}>Comida</button>
              <button onClick={() => setCategoria("te")}>Té</button>
            </div>

            <div className="grid">
              {productos.map((p) => (
                <div className="card" key={p.id}>
                  <img src={`http://127.0.0.1:8000${p.imagen}`} alt="" />
                  <h3>{p.nombre}</h3>
                  <p>{p.descripcion}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 🔥 GALERÍA */}
        {vista === "galeria" && (
          <>
            <h1>Galería</h1>

            {!usuario && (
              <p style={{ color: "red" }}>
                ⚠️ Debes iniciar sesión para publicar
              </p>
            )}

            {/* FORM */}
            {usuario && (
              <div className="form-post">
                <textarea
                  placeholder="Escribe tu experiencia..."
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                />

                <input
                  type="file"
                  onChange={(e) => setImagen(e.target.files[0])}
                />

                <button onClick={publicarPost}>
                  Publicar
                </button>
              </div>
            )}

            {/* POSTS */}
            <div className="galeria">
              {galeria.map((g) => (
                <div className="post" key={g.id}>

                  <div className="post-header">
                    <div className="avatar"></div>
                    <h4>{g.usuario}</h4>
                  </div>

                  <img
                    src={`http://127.0.0.1:8000${g.imagen}`}
                    alt=""
                    className="post-img"
                  />

                  <div className="post-body">
                    <p>{g.descripcion}</p>
                  </div>

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