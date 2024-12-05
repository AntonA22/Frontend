/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
// import mockImage from "src/assets/mock.png";
// import { dest_img } from "../../../target_config";
import "./ShipCard2.css";
import {Link} from "react-router-dom";
import {Button} from "reactstrap";
import { T_Ship } from "src/modules/types";
import {useAppDispatch, useAppSelector} from "src/store/store.ts";
import {removeShipFromDraftFlight, updateShipValue} from "src/store/slices/flightsSlice.ts";


type ShipCardProps = {
    ship: T_Ship,
    showRemoveBtn?: boolean,
    editMM?: boolean
}

export const ShipCard = ({ship, showRemoveBtn = false, editMM = false}:ShipCardProps) => {
    // Определяем URL изображения

    const dispatch = useAppDispatch()

    const {save_mm} = useAppSelector(state => state.flights)

    const [local_payload, setLocal_payload] = useState(Number(ship.payload))


    const handleRemoveFromDraftFlight = async () => {
        try {
            console.log("Удаление корабля с ID:", ship.id);
            await dispatch(removeShipFromDraftFlight(ship.id));
            console.log("Удаление прошло успешно.");
        } catch (error) {
            console.error("Ошибка при удалении корабля:", error);
        }
    };

    useEffect(() => {
        console.log("Отправляемое значение:", Number(local_payload));
        dispatch(updateShipValue({
            ship_id: ship.id,  
            payload2: Number(local_payload)  
        }));
        console.log(Number(local_payload), local_payload)
    }, [save_mm]);

    // const isMock = useState(false);
    // const imageUrl =
    //     dest_img === "img-proxy"
    //     ? isMock
    //         ? (mockImage as string)
    //         : ship.image
    //     : ship.image.replace("localhost", "172.20.10.11");

    return (
        <div className="card w-100 mb-5 custom-card">
            <div className="row g-0">
                <div className="col-md-6 d-flex justify-center custom-height-img">
                    <img src={ship.image} alt={ship.name} className="img-fluid" style={{ height: "300px" }} />
                </div>
                <div className="col-md-6 custom-inf-card-style">
                    <div className="card-body d-flex flex-column justify-content-between">
                        <h5 className="card-title">{ship.name}</h5>
                        <p className="card-text">Дата изготовления: {ship.creation_date}</p>
                        <div className="form-group">
                            <label className="form-label">Полезная нагрузка (кг):</label>
                            <input
                                placeholder="Введите полезную нагрузку"
                                type="number"
                                className="form-control"
                                style={{ width: "255px" }}
                                value={Number(local_payload)}
                                onChange={(e) => {
                                    console.log("Введённое значение:", e.target.value);
                                    setLocal_payload(Number(e.target.value));
                                }}
                                disabled={!editMM}
                            />
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                            <Link to={`/ships/${ship.id}`}>
                                <Button color="primary">
                                    Открыть
                                </Button>
                            </Link>
                            {showRemoveBtn && (
                                <Button color="primary" onClick={handleRemoveFromDraftFlight}>
                                    Удалить
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipCard;