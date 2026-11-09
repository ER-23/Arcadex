import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/" className="logo">ARCADEX</Link>
            
            <div className="nav-enlaces">
                <Link to="/">Inicio</Link>
                <Link to="/productos">Productos</Link>
                <Link to="/login">Administradores</Link>
            </div>
        </nav>
    )
}

export default Navbar