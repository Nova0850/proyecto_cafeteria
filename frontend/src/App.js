import React, { useEffect, useState } from "react";
import "./App.css";

function App(){

/* ================= ESTADOS ================= */

const [productos,setProductos]=useState([]);
const [categoria,setCategoria]=useState("todos");
const [buscar,setBuscar]=useState("");
const [vista,setVista]=useState("inicio");

const [config,setConfig]=useState(null);
const [contacto,setContacto]=useState(null);


/* galeria */
const [galeria,setGaleria]=useState([]);
const [nuevaDescripcion,setNuevaDescripcion]=useState("");
const [imagen,setImagen]=useState(null);


/* auth */
const [usuario,setUsuario]=useState(null);

const [mostrarLogin,setMostrarLogin]=useState(false);
const [modoRegistro,setModoRegistro]=useState(false);

const [username,setUsername]=useState("");
const [password,setPassword]=useState("");

const [quienes,setQuienes] = useState(null);
const [diferencial,setDiferencial] = useState([]);
/* ================= PRODUCTOS ================= */

const obtenerProductos=()=>{

let url="http://127.0.0.1:8000/api/productos/?";

if(categoria!=="todos"){
url+=`categoria=${categoria}&`;
}

if(buscar){
url+=`buscar=${buscar}`;
}

fetch(url)
.then(res=>res.json())
.then(data=>setProductos(data))
.catch(console.error);

};



/* ================= GALERIA ================= */

const obtenerGaleria=()=>{

fetch(
"http://127.0.0.1:8000/api/galeria/"
)
.then(res=>res.json())
.then(data=>setGaleria(data))
.catch(console.error);

};



/* ================= REGISTRO ================= */

const registrarUsuario=()=>{

fetch(
"http://127.0.0.1:8000/api/registro/",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username,
password
})
}
)
.then(res=>res.json())
.then(data=>{

if(data.usuario){

alert("Cuenta creada correctamente");

setModoRegistro(false);

}
else{
alert(data.error || "Error registrando usuario");
}

})
.catch(()=>{
alert("Error conectando backend");
});

};



/* ================= LOGIN ================= */

const loginUsuario=()=>{

fetch(
"http://127.0.0.1:8000/api/login/",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username,
password
})
}
)
.then(res=>res.json())
.then(data=>{

if(data.usuario){

setUsuario(
data.usuario
);

localStorage.setItem(
"usuario",
data.usuario
);

alert("Sesión iniciada");

setMostrarLogin(false);

setUsername("");
setPassword("");

}else{
alert("Credenciales incorrectas");
}

})
.catch(()=>{
alert("Error conectando backend");
});

};



/* ================= LOGOUT ================= */

const cerrarSesion=()=>{

setUsuario(null);

localStorage.removeItem(
"usuario"
);

};


/* ================= CONTACTOS DESDE BD ================= */

const abrirInstagram=()=>{

if(!contacto) return;

window.open(
contacto.instagram,
"_blank"
);

};


const abrirFacebook=()=>{

if(!contacto) return;

window.open(
contacto.facebook,
"_blank"
);

};


const abrirTikTok=()=>{

if(!contacto) return;

window.open(
contacto.tiktok,
"_blank"
);

};


const abrirWhatsapp=()=>{

if(!contacto) return;

const mensaje=encodeURIComponent(
contacto.mensaje_reserva
);

window.open(
`https://wa.me/591${contacto.whatsapp}?text=${mensaje}`,
"_blank"
);

};



/* ================= PUBLICAR ================= */

const publicarPost=()=>{

if(!usuario){
alert("Debes iniciar sesión");
return;
}

if(!nuevaDescripcion || !imagen){
alert("Falta descripción o imagen");
return;
}

const formData=new FormData();

formData.append(
"usuario",
usuario
);

formData.append(
"descripcion",
nuevaDescripcion
);

formData.append(
"imagen",
imagen
);


fetch(
"http://127.0.0.1:8000/api/galeria/",
{
method:"POST",
body:formData
}
)
.then(res=>res.json())
.then(()=>{

alert("Historia publicada");

setNuevaDescripcion("");
setImagen(null);

obtenerGaleria();

})
.catch(()=>{
alert("Error publicando");
});

};



/* ================= CONTROL ================= */

useEffect(()=>{

const guardado=
localStorage.getItem("usuario");

if(guardado){
setUsuario(guardado);
}


if(vista==="menu"){
obtenerProductos();
}
else if(vista==="inicio"){

fetch(
"http://127.0.0.1:8000/api/destacados/"
)
.then(res=>res.json())
.then(data=>setProductos(data));


fetch(
"http://127.0.0.1:8000/api/configuracion/"
)
.then(res=>res.json())
.then(data=>setConfig(data));


fetch(
"http://127.0.0.1:8000/api/contacto/"
)
.then(res=>res.json())
.then(data=>setContacto(data));

/* QUIENES SOMOS */
fetch(
"http://127.0.0.1:8000/api/quienes-somos/"
)
.then(res=>res.json())
.then(data=>setQuienes(data));


/* DIFERENCIAL */
fetch(
"http://127.0.0.1:8000/api/diferencial/"
)
.then(res=>res.json())
.then(data=>setDiferencial(data));

}

else if(vista==="galeria"){
obtenerGaleria();
}


},[
categoria,
buscar,
vista
]);



return(

<div className="container">


{/* SIDEBAR */}

<div className="sidebar">

<h2>Cafetería</h2>

<ul>

<li onClick={()=>setVista("inicio")}>
Inicio
</li>

<li onClick={()=>setVista("menu")}>
Menú
</li>

<li onClick={()=>setVista("galeria")}>
Galería
</li>
</ul>

</div>




{/* CONTENIDO */}

<div className="content">


{/* TOPBAR */}

<div className="topbar">

{usuario ?(

<div>

<span>
👤 {usuario}
</span>

<button
onClick={cerrarSesion}
style={{marginLeft:"15px"}}
>
Cerrar sesión
</button>

</div>

):(

<button
onClick={()=>setMostrarLogin(true)}
>
Iniciar sesión
</button>

)}

</div>




{/* MODAL LOGIN / REGISTRO */}

{mostrarLogin &&(

<div className="modal">

<div className="modal-box">

<h2>
{modoRegistro
? "Crear Cuenta"
: "Iniciar Sesión"}
</h2>


<input
placeholder="Usuario"
value={username}
onChange={(e)=>
setUsername(
e.target.value
)}
/>


<input
type="password"
placeholder="Contraseña"
value={password}
onChange={(e)=>
setPassword(
e.target.value
)}
/>


{modoRegistro ?(

<button onClick={registrarUsuario}>
Crear cuenta
</button>

):(

<button onClick={loginUsuario}>
Entrar
</button>

)}


<p
style={{
cursor:"pointer",
color:"blue"
}}
onClick={()=>
setModoRegistro(
!modoRegistro
)}
>

{modoRegistro
?"Ya tengo cuenta"
:"Crear cuenta"}

</p>


<button
onClick={()=>
setMostrarLogin(false)
}
>
Cerrar
</button>

</div>

</div>

)}







{/* INICIO */}

{vista==="inicio" && (

<>

<h1>Bienvenido</h1>


{/* QUIENES SOMOS */}
{quienes && (

<section className="quienes-somos">

<div className="quienes-texto">

<h2>{quienes.titulo}</h2>

<p>{quienes.descripcion_1}</p>

{quienes.descripcion_2 &&
<p>{quienes.descripcion_2}</p>}

{quienes.descripcion_3 &&
<p>{quienes.descripcion_3}</p>}

{quienes.frase_destacada && (
<h3>
{quienes.frase_destacada}
</h3>
)}

</div>


{quienes.imagen && (
<img
src={`http://127.0.0.1:8000${quienes.imagen}`}
alt={quienes.titulo}
/>
)}

</section>

)}



{/* DIFERENCIAL */}
<section className="diferencial-section">

<h2>Diferencial</h2>

<div className="grid">

{diferencial.map((item)=>(

<div
className="card"
key={item.id}
>
<h3>{item.titulo}</h3>
<p>{item.descripcion}</p>
</div>

))}

</div>

</section>



<h2>Productos destacados</h2>

<div className="grid">
{productos.map((p)=>(

<div className="card" key={p.id}>
<img
src={
p.imagen
? `http://127.0.0.1:8000${p.imagen}`
:"https://via.placeholder.com/150"
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

<p>
<strong>Dirección:</strong>
{config.direccion}
</p>

<h3>Horarios</h3>

<p>Lunes a Viernes: {config.horario_lunes_viernes}</p>
<p>Sábado: {config.horario_sabado}</p>
<p>Domingo: {config.horario_domingo}</p>


<iframe
title="mapa"
width="100%"
height="400"
src={`https://www.google.com/maps?q=${config.latitud},${config.longitud}&z=15&output=embed`}
></iframe>



{/* CONTACTOS DEBAJO DEL MAPA */}
{contacto && (

<div className="contactos-section">

<h2>Contáctanos</h2>

<button onClick={abrirInstagram}>
📸 Instagram
</button>

<button onClick={abrirFacebook}>
📘 Facebook
</button>

<button onClick={abrirTikTok}>
🎵 TikTok
</button>

<button onClick={abrirWhatsapp}>
💬 Reservar por WhatsApp
</button>

<p>
Telefono 📞 {contacto.telefono}
</p>
<p>
Correro electronico:  {contacto.email}
</p>

</div>

)}

</div>

)}

</>

)}






{/* MENU */}

{vista==="menu" &&(

<>

<h1>Menú</h1>

<input
placeholder="Buscar..."
onChange={(e)=>
setBuscar(
e.target.value
)}
/>

<div>

<button onClick={()=>setCategoria("todos")}>
Todos
</button>

<button onClick={()=>setCategoria("bebida")}>
Bebidas
</button>

<button onClick={()=>setCategoria("comida")}>
Comida
</button>

<button onClick={()=>setCategoria("te")}>
Té
</button>

</div>



<div className="grid">

{productos.map((p)=>(

<div
className="card"
key={p.id}
>

<img
src={
p.imagen
?`http://127.0.0.1:8000${p.imagen}`
:"https://via.placeholder.com/150"
}
alt={p.nombre}
/>

<h3>{p.nombre}</h3>

<p>{p.descripcion}</p>

</div>

))}

</div>

</>

)}








{/* GALERIA */}

{vista==="galeria" &&(

<>

<h1>Galería</h1>


{!usuario &&(

<p style={{color:"red"}}>
⚠ Debes iniciar sesión para publicar
</p>

)}



{usuario &&(

<div className="form-post">

<textarea
placeholder="Escribe tu experiencia..."
value={nuevaDescripcion}
onChange={(e)=>
setNuevaDescripcion(
e.target.value
)}
/>

<input
type="file"
onChange={(e)=>
setImagen(
e.target.files[0]
)}
/>


<button onClick={publicarPost}>
Publicar historia
</button>

</div>

)}



<div className="galeria">

{galeria.map((g)=>(

<div
className="post"
key={g.id}
>

<div className="post-header">

<div className="avatar"></div>

<h4>
{g.usuario}
</h4>

</div>


<img
src={
g.imagen
?`http://127.0.0.1:8000${g.imagen}`
:"https://via.placeholder.com/300"
}
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