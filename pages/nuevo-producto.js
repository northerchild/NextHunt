import React,{useState,useContext} from 'react';
import {css} from '@emotion/react';
import {useRouter} from 'next/router';
import Layout from '../components/layout/Layout';
import { Campo, Error, Formulario, InputSubmit } from '../components/ui/formulario';
import {FirebaseContext} from '../firebase';
import FileUploader from 'react-firebase-file-uploader';
//Validación
import useValidacion from  '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';
import Error404 from '../components/layout/404';

const STATE_INICIAL = {
  nombre:'',
  empresa: '',
  //imagen: '',
  url:'',
  descripcion:'',
}



export default function NuevoProducto() {
  // state de las imagenes
  const [nombreimagen, guardarNombre] = useState('');
  const [subiendo, guardarSubiendo] = useState(false);
  const [ progreso, guardarProgreso ] = useState(0);
  const [urlimagen, guardarUrlImagen] = useState('');

  const [ error, guardarError] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  // hook de routing para redireccionar
  const router = useRouter();

  // context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function crearProducto() {

    // si el usuario no esta autenticado llevar al login
    if(!usuario) {
      return router.push('/login');
    }

    // crear el objeto de nuevo producto 
    const producto = {
        nombre, 
        empresa, 
        url, 
        urlimagen,
        descripcion,
        votos: 0,
        comentarios: [],
        creado: Date.now(), 
        creador: {
          id: usuario.uid,
          nombre: usuario.displayName
        }, 
        haVotado: []
    }

    // insertarlo en la base de datos
    firebase.db.collection('productos').add(producto);

    return router.push('/');

  }


  const handleUploadStart = () => {
      guardarProgreso(0);
      guardarSubiendo(true);
  }

  const handleProgress = progreso => guardarProgreso({ progreso });

  const handleUploadError = error => {
      guardarSubiendo(error);
      console.error(error);
  };

  const handleUploadSuccess = nombre => {
      guardarProgreso(100);
      guardarSubiendo(false);
      guardarNombre(nombre)
      firebase
          .storage
          .ref("productos")
          .child(nombre)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            guardarUrlImagen(url);
          } );
  };

  return (
    <Layout>
      {!usuario ? <Error404/> : (
        <>
        <h1 css={css`text-align:center;`}>Nuevo Producto</h1>
        <Formulario onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>Información General</legend>

            <Campo>
            <label htmlFor="nombre">Nombre del producto</label>
              <input 
              type="text"
              id="nombre"
              placeholder="Nombre del producto"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              onBlur={handleBlur}/>
          </Campo>
          {errores.nombre && <Error>{errores.nombre}</Error>}
          <Campo>
            <label htmlFor="empresa">Empresa</label>
              <input 
              type="text"
              id="empresa"
              placeholder="Nombre Empresa o compañia"
              name="empresa"
              value={empresa}
              onChange={handleChange}
              onBlur={handleBlur}/>
          </Campo>
          {errores.empresa && <Error>{errores.empresa}</Error>}
          <Campo>
            <label htmlFor="imagen">Imagen</label>
              <FileUploader
                accept="image/*" 
                id="imagen"
                name="imagen"
                randomizerFilename
                storageRef={firebase.storage.ref("productos")}
                onUploadStart={handleUploadStart}
                onUploadError={handleUploadError}
                onUploadSuccess={handleUploadSuccess}
                onProgress={handleProgress}
              />
          </Campo>
          <Campo>
            <label htmlFor="url">Url</label>
              <input 
              type="url"
              id="url"
              name="url"
              value={url}
              onChange={handleChange}
              onBlur={handleBlur}/>
          </Campo>
          {errores.url && <Error>{errores.url}</Error>}
          </fieldset>
          <fieldset>
            <legend>Sobre tu producto</legend>
            <Campo>
            <label htmlFor="descripcion">Descripción</label>
              <textarea 
              id="descripcion"
              name="descripcion"
              value={descripcion}
              onChange={handleChange}
              onBlur={handleBlur}/>
          </Campo>
          {errores.descripcion && <Error>{errores.descripcion}</Error>}
          </fieldset>
          {error && <Error>{error}</Error>}
          <InputSubmit 
            type="submit"
            value="Crear Nuevo Producto"/>
        </Formulario>
      </>
      ) }
    </Layout>
  )
}