import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";



export const Private_page = () => {

    const [nameUser, setNameUser] = useState()

    const getPrivateInfo = async () => {
        console.log("estoy trayendo informacion privada")
        const token = localStorage.getItem("token-jwt")
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "my_username", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + token
            }
        })

        console.log(response)
        if (!response.ok) {
            setNameUser("No se encontro informacion asociada a un usuario registrado")
            return response.json()
        }
        const data = await response.json()
        console.log(data.name)
        setNameUser("Aqui encontraras la informacion de: " + data.name)
    }

    useEffect(() => {
        getPrivateInfo()
    }, [])


    return (

        <div className="text-center mt-5 mb-5">
            <h3>Bienvenido a tu sesion </h3>
            <h2>{nameUser}</h2>
            <Link className='container d-flex text-center m-5' to="/">
                <a className="d-flex align-items-start">Back Home</a>
            </Link>
        </div>


    )
}