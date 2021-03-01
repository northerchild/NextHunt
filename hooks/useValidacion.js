import React,{useState, useEffect} from 'react';

const useValidacion = (stateIncial,validar,fn) => {
    const [valores, guadarValores] = useState(stateIncial);
    const [errores, guardarErrores] = useState({});
    const [submitForm, guardarSubmitForm] = useState(false);
    useEffect(()=>{
        if(submitForm){
            const noErrores = Object.keys(errores).length === 0;
            if(noErrores){
                fn() //fn = función que se ejecuta en el componente;
            }
            guardarSubmitForm(false);
        }
    },[errores])
    //Funcion que se ejecuta conforme el usuario escribe algo
    const handleChange = e =>{
        guadarValores({
            ...valores,
            [e.target.name]: e.target.value
        })
    }
    //Función que se ejecuta cuando el usuario hac submit 
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
        guardarSubmitForm(true);
    }
    //Cuando se realiza el evento del blur
    const handleBlur = ()=>{
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
    }
    return {
        valores,
        errores,
        submitForm,
        handleChange,
        handleSubmit,
        handleBlur

    }
}

export default useValidacion;