import React, { createContext, useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axiosConfig from "./axiosConfig";

export const authContext = createContext();

function ProtectedRoutes() {
    const [users, SetUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    async function checkUser() {
        if (!token) {
            navigate("/login");
            setLoading(false);
            return;
        }
        try {
            const { data } = await axiosConfig.get("auth/me", {

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            SetUsers(data);
            console.log(data);
        } catch (error) {
            console.log(error.message);
            navigate("/login");
        }
        setLoading(false);
    }

    useEffect(() => {
        checkUser();
    }, []);



    return (
        <authContext.Provider value={{ users, SetUsers }}>
            {users ? <Outlet /> : <Navigate to="/login" />}
        </authContext.Provider>
    );
}

export default ProtectedRoutes;
