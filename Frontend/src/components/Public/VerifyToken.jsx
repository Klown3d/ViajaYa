import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Ajusta el path

function VerifyToken() {
  const { setIsAuthenticated, setUserData } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('access');

    if (token) {
      fetch('http://127.0.0.1:8000/conseguir_mi_usuario/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        })
        .then(data => {
          setIsAuthenticated(true);
          setUserData(data);
        })
        .catch(error => {
          console.error('Error:', error);
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated, setUserData]);

  return null;
}

export default VerifyToken;
