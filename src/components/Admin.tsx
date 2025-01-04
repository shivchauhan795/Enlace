import Cookies from "universal-cookie"
import { useNavigate } from "react-router-dom";
const cookies = new Cookies();
const Admin = () => {
    const navigate = useNavigate();
    return (
        <div>
            This is admin
            <button onClick={() => {
                cookies.remove("ENLACEE_TOKEN");
                navigate("/login");
            }}
            className="bg-rose-500 hover:bg-rose-600 text-white font-medium uppercase py-2 px-4 rounded-lg m-2"
            >Logout</button>
        </div>
    )
}

export default Admin
