import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const Navigate = useNavigate()
	const [usertoAccess, setUserToAccess] = useState({
		email: "",
        password: ""
	})


	
	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
		//login()
	}, [])


	const login = function(e){
		e.preventDefault()
		console.log("estoy logeandome")
		fetch(import.meta.env.VITE_BACKEND_URL + "login", {
			method: "POST",
			headers : {"Content-Type": "application/json"},
			body: JSON.stringify(usertoAccess)
		})
		.then((response)=>{
			if(!response.ok) {
			alert('error correo o contraseña equivocados')}
			return response.json()
			
		})
		.then((data)=>{
			console.log(data)
			localStorage.setItem("token-jwt", data.token)
			Navigate('/private_page')
		})
		.catch((error)=>{error})
	}

	return (
		<div className="text-center mt-5 mb-5">
			<h3 className="">PROYECTO DE AUTENTICACION JWT</h3>
			<p className="">By: Andrea Nolasco</p>


			<div className="container text-start mt-5 col-4">
				<form onSubmit={login} className="">
					<div className="mb-3">
						<label for="exampleInputEmail1" className="form-label">Username:</label>
						<input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
							onChange={(e)=>{setUserToAccess({...usertoAccess, email: e.target.value})}} />
						<div id="emailHelp" className="form-text">Ingrese el correo electrónico registrado.</div>
					</div>
					<div className="mb-3">
						<label for="exampleInputPassword1" className="form-label">Password:</label>
						<input type="password" className="form-control" id="exampleInputPassword1" 
							onChange={(e)=>{setUserToAccess({...usertoAccess, password: e.target.value})}}
						/>
					</div>
					<button type="submit" className="btn btn-primary">Log in</button>

					<Link to="/register">
						<button className="btn btn-primary ms-5">Registrarme</button>
					</Link>
				</form>
				

			</div>

		</div>

	);
}; 