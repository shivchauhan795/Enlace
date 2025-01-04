import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function ProtectedRoutes() {
    // Get token from cookies
    const token = cookies.get("ENLACEE_TOKEN");

    // If token exists, render the component, otherwise redirect to login
    return token ? <Outlet /> : <Navigate to="/login" />;
}