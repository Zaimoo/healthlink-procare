import { NavLink } from "react-router-dom";


export default function NavBar() {
    return (
        <nav className="nav">
        <a href="/" className="site-title">HealthLink ProCare</a>
            <ul>
                <li>
                <NavLink to="/" >
                            Dashboard
                    </NavLink>

                </li>
                <li>
                    <NavLink to="/patients">
                            Patients
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admissions" >
                            Admissions
                    </NavLink>
                </li>
            </ul>
        </nav>
    )

}