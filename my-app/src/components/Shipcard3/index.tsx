import {Button} from "reactstrap";
import mockImage from "src/assets/mock.png";
import {Link} from "react-router-dom";
import {T_Ship} from "modules/types.ts";
import { dest_img } from "../../../target_config"
// import {useAppSelector} from "store/store.ts";
import {useAppDispatch} from "src/store/store.ts";
import {deleteShip} from "src/store/slices/shipsSlice.ts";

interface ShipCardProps {
    ship: T_Ship,
    isMock: boolean,
    showAddBtn?: boolean,
}

const ShipCard: React.FC<ShipCardProps> = ({ ship, isMock }) => {
    // const isAuthenticated = useAppSelector((state) => state.cookie.is_authenticated)
    const dispatch = useAppDispatch()


    const handleClickDelete = async () => {
        try {
            console.log("Удаление корабля с ID:", ship.id);
            await dispatch(deleteShip(ship.id));
            console.log("Удаление прошло успешно.");
        } catch (error) {
            console.error("Ошибка при удалении корабля:", error);
        }
    };


    return (
        <div key={ship.id} className="card mb-3 service-card-container">
        <div className="row g-0">
            <div className="col-md-1 card-body">
                <img
                    src={dest_img === "img-proxy"
                        ? (isMock ? mockImage as string : ship.image)
                        : ship.image.replace("localhost", "172.20.10.11")}
                    className="img-fluid rounded-start"
                    alt={ship.name}
                    width="75px"
                />
            </div>
            <div className="col-md-4 card-body d-flex justify-content-between">
                <div>
                    <h5 className="card-title">
                        <Link
                            to={`/ships/${ship.id}`}
                            id={ship.name}
                            className="text-white h3"
                            state={{ from: ship.name }}
                        >
                            <strong>{ship.name}</strong>
                        </Link>
                    </h5>
                </div>
                <div className="d-flex  ms-3">
                    <p className="card-text h4">
                        Дата изготовления: {ship.creation_date}
                    </p>
                </div>
            </div>
            <div className="col-md-1 card-body">
                <Link
                    to={`/edit_ship/${ship.id}`}
                    className="btn btn-primary"
                >
                    Изменить
                </Link>
            </div>
            <div className="col-md-1 card-body">
                <Button
                    color="primary"
                    onClick={handleClickDelete}
                >
                    Удалить
                </Button>
            </div>
        </div>
    </div>
    )
};

export default ShipCard