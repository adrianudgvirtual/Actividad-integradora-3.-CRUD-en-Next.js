import { NavLink } from '.';

export { Nav };

function Nav() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink href="/" exact className="nav-item nav-link">Inicio</NavLink>
                <NavLink href="/users" className="nav-item nav-link">Usuarios</NavLink>
            </div>
        </nav>
    );
}