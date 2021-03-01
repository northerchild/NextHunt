import React,{useState} from 'react';
import {css} from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Campo, Error, Formulario, InputSubmit } from '../components/ui/formulario';
import firebase from '../firebase';
//Validación
import useValidacion from  '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCuenta';

const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: '',
}

export default function CrearCuenta() {
  const [error, guardarError] = useState(false);
  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur} = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

    const {nombre, email, password} = valores;

  async function crearCuenta(){
    try {
      await firebase.registrar(nombre,email,password);
      Router.push('/');
    } catch (error) {
      console.log('Hubo un error al crear el usuario',error.message);
      guardarError(error.message);
    }
  }

  return (
    <Layout>
      <>
        <h1 css={css`text-align:center;`}>Crear Cuenta</h1>
        <Formulario onSubmit={handleSubmit} noValidate>
          <Campo>
            <label htmlFor="nombre">Nombre</label>
              <input 
              type="text"
              id="nombre"
              placeholder="Tu Nombre"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              onBlur={handleBlur}/>
          </Campo>
          {errores.nombre && <Error>{errores.nombre}</Error>}
          <Campo>
            <label htmlFor="email">Email</label>
              <input 
              type="email"
              id="email"
              placeholder="Tu Email"
              name="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}/>
          </Campo>
          {errores.email && <Error>{errores.email}</Error>}
          <Campo>
            <label htmlFor="password">Password</label>
              <input 
              type="password"
              id="password"
              placeholder="Tu contraseña"
              name="password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}/>
          </Campo>
          {errores.password && <Error>{errores.password}</Error>}
          {error && <Error>{error}</Error>}
          <InputSubmit 
            type="submit"
            value="Crear Cuenta"/>
        </Formulario>
      </>
    </Layout>
  )
}
