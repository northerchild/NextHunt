import React, {useState,useEffect, useContext} from 'react';
import { DetallesProductos } from '../components/layout/DetallesProductos';
import Layout from '../components/layout/Layout';
import {FirebaseContext} from '../firebase';

export default function Home() {
  const [productos, guardarProductos] = useState([]);
  const {firebase} = useContext(FirebaseContext)
  useEffect(() => {
    const obtenerProductos = ()=> {
      firebase.db.collection('productos').orderBy('creado','desc').onSnapshot(manejarSnapshot)
    }
    obtenerProductos()
  }, [])

  function manejarSnapshot(snapshot){
    const producto = snapshot.docs.map(doc => {
      return{
        id: doc.id,
        ...doc.data()
      }
    });
    guardarProductos(producto);
  }
  return (
    <Layout>
      <div className="listado-productos">
          <div className="contenedor">
            <div className="bg-white">
              {productos.map(producto =>(
                <DetallesProductos 
                  key={producto.id}
                  producto={producto}/>
              ))}
            </div>
          </div>
      </div>
    </Layout>
  )
}
