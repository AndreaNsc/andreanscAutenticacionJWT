import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";



export const Show_private_info = () => {

    const [passwordUser, setPasswordUser] = useState()

    const getPrivateInfo = async () => {
        console.log("estoy trayendo informacion privada")
        const token = localStorage.getItem("token-jwt")
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "my_password", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": 'Bearer ' + token
            }
        })

        console.log(response)
        if (!response.ok) {
            setPasswordUser("No se encontro informacion asociada a un usuario registrado")
            return response.json()
        }
        const data = await response.json()
        console.log(data.password)
        setPasswordUser(data.password)
    }

    useEffect(() => {
        getPrivateInfo()
    }, [])


    return (

        <div className="text-center mt-5 mb-5">
            <h1><i class="fa-solid fa-face-flushed"></i> </h1>
            <h2>Tu password es</h2>
            <h3>{passwordUser}</h3>
            <Link className='container d-flex text-center m-5' to="/">
                <a className="d-flex align-items-start">Back Home</a>
            </Link>
        </div>


    )
}