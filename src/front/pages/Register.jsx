import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";


export const Register = () => {

    const navigate = useNavigate()
    const [newUser, setNewUser] = useState({
        username: "",
        password: ""
    })


    function createUser(e) {
        e.preventDefault()
        console.log(newUser)
        // debo hacer el fetch para crear un nuevo usuario
        console.log(import.meta.env.VITE_BACKEND_URL)

        fetch(import.meta.env.VITE_BACKEND_URL + "create_user", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error al crear usuario en la BD")
                return response.json()
            })
            .then((data) => {
                console.log(data)
                alert("USUARIO CREADO EXITOSAMENTE")
                navigate("/")
            })
            .catch((error) => {
                console.log(error)
            })


    }

    return (
        <div className="text-center mt-5 mb-5">
            <h3 className="">REGISTRAR NUEVO USUARIO</h3>
            <p className="">Ingresa los datos del usuario a registrar</p>


            <div className="container text-start mt-5 col-4">
                <form onSubmit={createUser} className="">
                    <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Username:</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Ingrese su email'
                            onChange={(e) => { setNewUser({ ...newUser, username: e.target.value }) }} />
                        <div id="emailHelp" className="form-text">El Username sera el email registrado en este campo.</div>
                    </div>
                    <div className="mb-3">
                        <label for="exampleInputPassword1" className="form-label">Password:</label>
                        <input type="password" className="form-control" id="exampleInputPassword1"
                            onChange={(e) => { setNewUser({ ...newUser, password: e.target.value }) }} />
                    </div>
                    <button type="submit" className="btn btn-primary">Crear Usuario</button>

                </form>


            </div>

        </div>



    )
}