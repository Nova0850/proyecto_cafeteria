import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("todos");
  const [buscar, setBuscar] = useState("");

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

  useEffect(() => {
    obtenerProductos();
  }, [categoria, buscar]);

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Cafetería</h2>
        <ul>
          <li>Inicio</li>
          <li className="active">Menú</li>
          <li>Galería</li>
        </ul>
      </div>

      {/* Contenido */}
      <div className="content">
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
              <h3>{p.nombre}</h3>
              <p>{p.descripcion}</p>
              <span>Bs. {p.precio}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;