import {Container, Navbar } from "reactstrap";
import { NavLink } from "react-router-dom";
import {useState} from "react";
import {useAppSelector, useAppDispatch} from "src/store/store.ts";
import './header.css';
import React from 'react';
import {handleLogout} from "src/store/slices/cookieSlice"
import { useNavigate } from 'react-router-dom';;


const Header = () => {

	const dispatch = useAppDispatch()

	const navigate = useNavigate();

	const [collapsed, setCollapsed] = useState(true);

    const isAuthenticated = useAppSelector((state) => state.cookie.is_authenticated)
	const isModerator = useAppSelector((state) => state.cookie.is_moderator)

	const username = useAppSelector((state) => state.cookie.username)
	console.log(username)
	
	const logout = async (e:  React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        await dispatch(handleLogout())
        navigate("/")
    }

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

								<>
									{isAuthenticated ? (
										isModerator ? (
											<>
												<div className="nav-item">
													<NavLink className="nav-link" to="/moderator_ships/">
														Космолеты
													</NavLink>
												</div>
												<div className="nav-item">
													<NavLink className="nav-link" to="/moderator_flights/">
														Перелеты
													</NavLink>
												</div>
												<div className="nav-item">
													<NavLink className="nav-link" to="/profile/">
														{username}
													</NavLink>
												</div>
												<div className="nav-item">
													<NavLink className="nav-link" onClick={logout} to="">
														Выйти
													</NavLink>
												</div>
											</>
										) : (
											<>
												<div className="nav-item">
													<NavLink to="/ships/" className="nav-link" onClick={hideMenu}>
														Космолеты
													</NavLink>
												</div>
												<div className="nav-item">
													<NavLink className="nav-link" to="/flights/">
														Перелеты
													</NavLink>
												</div>
												<div className="nav-item">
													<NavLink className="nav-link" to="/profile/">
														{username}
													</NavLink>
												</div>
												<div className="nav-item">
													<NavLink className="nav-link" onClick={logout} to="">
														Выйти
													</NavLink>
												</div>
											</>
										)
									) : (
										
										<>
											<div className="nav-item">
												<NavLink to="/ships/" className="nav-link" onClick={hideMenu}>
													Космолеты
												</NavLink>
											</div>
											<div className="nav-item">
												<NavLink className="nav-link" to="/login/">
													Войти
												</NavLink>
											</div>
											<div className="nav-item">
												<NavLink className="nav-link" to="/register/">
													Зарегистрироваться
												</NavLink>
											</div>
										</>
									)}
								</>

							</div>
						</div>
					</div>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;