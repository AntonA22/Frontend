
import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {useAppSelector} from "src/store/store.ts";

export const Breadcrumbs = () => {

    const location = useLocation()

    const selectedShip = useAppSelector((state) => state.ships.selectedShip)

    // const isAuthenticated = useAppSelector((state) => state.cookie?.is_authenticated);
    const isModerator = useAppSelector((state) => state.cookie?.is_moderator);

    const flight = useAppSelector((state) => state.flights.flight)

    const crumbs = () => {

        if (location.pathname == '/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/">
                            Главная
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/ships/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/ships/">
                            Космолеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/moderator_ships/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/moderator_ships/">
                            Космолеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/profile/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/profile/">
                            Профиль
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/moderator_flights/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/moderator_flights/">
                            Перелеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (selectedShip && !isModerator) {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/ships/">
                            Космолеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            {selectedShip?.name}
                        </Link>
                    </BreadcrumbItem>
                </>
            )
        }

        if (selectedShip && isModerator) {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/moderator_ships/">
                            Космолеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            {selectedShip?.name}
                        </Link>
                    </BreadcrumbItem>
                </>
            )
        }

        if (flight && !isModerator) {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to="/flights/">
                            Перелеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Перелет №{flight?.id}
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (flight && isModerator) {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to="/moderator_flights/">
                            Перелеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Перелет №{flight?.id}
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/flights/') {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Перелеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/login/') {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Вход
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/register/') {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Регистрация
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname.includes('/edit_ship/')) {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to="/moderator_ships/">
                            Космолеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }
        if (location.pathname == '/add_ship/') {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to="/moderator_ships/">
                            Космолеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        <Link to="/add_ship/">
                            Добавить новый космолет
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

    };

    return (
        <Breadcrumb className="fs-5">
            {crumbs()}
        </Breadcrumb>
    );
};