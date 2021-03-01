import React,{useState} from 'react';
import {css} from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Campo, Error, Formulario, InputSubmit } from '../components/ui/formulario';
import firebase from '../firebase';
//Validación
import useValidacion from  '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

const STATE_INICIAL = {
  email: '',
  password: '',
}

export default function Login() {
  const [error, guardarError] = useState(false);
  const {
    valores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur} = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

    const {email, password} = valores;

  async function iniciarSesion(){
    try {
      const usuario = await firebase.login(email,password);
      console.log(usuario)
      Router.push('/');
    } catch (error) {
      console.log('Hubo un error al autenticar el usuario',error.message);
      guardarError(error.message);
    }
  }

  return (
    <Layout>
      <>
        <h1 css={css`text-align:center;`}>Iniciar Sesión</h1>
        <Formulario onSubmit={handleSubmit} noValidate>
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
            value="Iniciar Sesión"/>
        </Formulario>
      </>
    </Layout>
  )
}
