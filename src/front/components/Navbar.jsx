import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
  
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();  

  useEffect(() => {
    const token = localStorage.getItem("token-jwt");
    setIsLogged(!!token);  
  }, [location]);  

  const handleLogout = () => {
    localStorage.removeItem("token-jwt");
    setIsLogged(false);
    navigate("/");
  };

  return (
    <nav className="container navbar navbar-light bg-light">
      <Link to="/" className="navbar-brand">Proyecto de Autenticación JWT</Link>

      <div className="ml-auto">
        {isLogged ? (
          <>
            <Link to="/show_private_info" 
			className="btn btn-primary me-2">Mi información privada
			</Link>
            <button onClick={handleLogout} className="btn btn-danger">Cerrar Sesión</button>
          </>
        ) : (
          <Link to="/" className="btn btn-success">Bienvenido</Link>
        )}
      </div>
    </nav>
  );
};