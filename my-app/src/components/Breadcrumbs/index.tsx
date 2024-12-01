import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {T_Ship} from "modules/types.ts";

interface BreadcrumbsProps {
    selectedShip: T_Ship | null
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ selectedShip }) => {

    const location = useLocation()

    return (
        <Breadcrumb className="fs-5" style={{ paddingLeft: "75px" }}>
			{location.pathname == "/" &&
				<BreadcrumbItem>
					<Link to="/">
						Главная
					</Link>
				</BreadcrumbItem>
			}
			{location.pathname.includes("/ships") &&
                <BreadcrumbItem active>
                    <Link to="/ships">
						Космолеты
                    </Link>
                </BreadcrumbItem>
			}
            {selectedShip &&
                <BreadcrumbItem active>
                    <Link to={location.pathname}>
                        { selectedShip.name }
                    </Link>
                </BreadcrumbItem>
            }
			<BreadcrumbItem />
        </Breadcrumb>
    );
};

export default Breadcrumbs