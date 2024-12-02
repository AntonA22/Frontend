import {Container, Navbar} from "reactstrap";
import { NavLink } from "react-router-dom";
import {useState} from "react";
import './header.css';
import { useSelector } from "react-redux"
import { RootState } from "src/store/store";

const Header = () => {

	const [collapsed, setCollapsed] = useState(true);

	const cookie = useSelector((state: RootState) => state.cookie.cookie);

	const hideMenu = () => setCollapsed(true);

	return (
		<header>
			<Navbar collapseOnSelect className="p-0" expand="lg">
				<Container className="p-0">
					<div className="navbar navbar-expand-lg navbar-dark">
						<div>
							<NavLink to="/" className="navbar-brand">
								Учет перелетов Starship между земными космодромами
							</NavLink>
						</div>
						<button 
							className="navbar-toggler" 
							type="button" 
							onClick={() => setCollapsed(!collapsed)} 
							aria-controls="responsive-navbar-nav" 
							aria-expanded={!collapsed} 
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<div 
							className={`collapse navbar-collapse ${!collapsed ? "show" : ""}`} 
							id="responsive-navbar-nav"
						>
							<div className="navbar-nav ml-auto fs-5 d-flex justify-content-end align-items-center w-100">
								{/* Элементы меню всегда справа */}
								<div className="nav-item">
									<NavLink to="/ships" className="nav-link" onClick={hideMenu}>
										Космолеты
									</NavLink>
								</div>
								{cookie && (
									<div className="nav-item">
										<NavLink to="/flights/6" className="nav-link" onClick={hideMenu}>
											Полет
										</NavLink>
									</div>
								)}


								{/* Показывать только если cookie существует */}
								{cookie && (
									<div className="nav-item">
										<NavLink to="/ships" className="nav-link" onClick={hideMenu}>
											Космолеты
										</NavLink>
									</div>
								)}

								{/* Показывать если cookie нет */}
								{!cookie && (
									<div className="nav-item">
										<NavLink to="/login" className="nav-link" onClick={hideMenu}>
											Войти
										</NavLink>
									</div>
								)}
							</div>
						</div>
					</div>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;