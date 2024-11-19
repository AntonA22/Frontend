import {Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from "reactstrap";
import { NavLink as RRNavLink} from "react-router-dom";
import {useState} from "react";

const Header = () => {
	const [collapsed, setCollapsed] = useState(true); // открыто или свернуто


	const hideMenu = () => setCollapsed(true)

    return (
		<header>
			<Navbar collapseOnSelect className="p-0" expand="lg">
				<Container className="p-0">
					<Navbar collapseOnSelect expand="lg" dark>
						<NavbarBrand tag={RRNavLink} to="/" className="text-wrap">
							Учет перелетов Starship между земными космодромами
						</NavbarBrand>
						<NavbarToggler aria-controls="responsive-navbar-nav" onClick={() => setCollapsed(!collapsed)} />
						<Collapse id="responsive-navbar-nav" navbar isOpen={!collapsed}>
							<Nav className="mr-auto fs-5 d-flex flex-grow-1 justify-content-end align-items-center" navbar>
								<NavItem>
									<NavLink tag={RRNavLink} onClick={hideMenu} to="/ships">
										Космолеты
									</NavLink>
								</NavItem>
							</Nav>
						</Collapse>
					</Navbar>
				</Container>
			</Navbar>
		</header>
    );
};

export default Header
