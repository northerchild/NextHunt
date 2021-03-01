import '../styles/globals.css'
import '../styles/app.css'
import firebase,{FirebaseContext} from '../firebase';
import useAutentication from '../hooks/useAutenticacion';


function MyApp(props) {
  const usuario = useAutentication();
  console.log(usuario)
  const {Component,pageProps} = props;
  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        usuario
      }}
    >
      <Component {...pageProps}/>
    </FirebaseContext.Provider>
  )
}

export default MyApp
