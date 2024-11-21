import {Container, Navbar} from "reactstrap";
import { NavLink } from "react-router-dom";
import {useState} from "react";
import './header.css';

const Header = () => {

	const [collapsed, setCollapsed] = useState(true);

	const hideMenu = () => setCollapsed(true)

    return (
		<header>
			<Navbar collapseOnSelect className="p-0" expand="lg">
				<Container className="p-0">
					<div className="navbar navbar-expand-lg navbar-dark">
						<div className="navbar-brand">
							<NavLink to="/" className="navbar-brand">
								Учет перелетов Starship между земными космодромами
							</NavLink>
						</div>
						<button className="navbar-toggler" type="button" onClick={() => setCollapsed(!collapsed)} aria-controls="responsive-navbar-nav" aria-expanded={!collapsed} aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
						</button>
						<div className={`collapse navbar-collapse ${!collapsed ? "show" : ""}`} id="responsive-navbar-nav">
						<div className="navbar-nav ml-auto fs-5 d-flex flex-grow-1 justify-content-end align-items-center">
							<div className="nav-item">
								<NavLink to="/ships" className="nav-link" onClick={hideMenu}>
									Космолеты
								</NavLink>
							</div>
						</div>
						</div>
					</div>
				</Container>
			</Navbar>
		</header>
    );
};

export default Header