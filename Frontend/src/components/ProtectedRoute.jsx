import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireStaff = false }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (!access) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/conseguir_mi_usuario/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => res.json())
      .then((userData) => {
        if (requireStaff && !userData.is_staff) {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        setAuthorized(false);
      })
      .finally(() => setLoading(false));
  }, [requireStaff]);

  if (loading) return <div>Cargando...</div>;

  return authorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
