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
<div key={ship.id} className="card mb-3 service-card-container" style={{ maxWidth: '1200px' }}>
    <div className="row g-0">
        {/* Увеличиваем изображение */}
        <div className="col-md-2 card-body">
            <img
                src={ship.image}  
                className="img-fluid rounded-start"
                alt={ship.name}
                width="150px"  
            />
        </div>

        {/* Колонка для названия и даты корабля */}
        <div className="col-md-3 card-body">
            <div className="card-title" style={{ fontSize: '1rem' }}>
                <Link
                    to={`/ships/${ship.id}`}  
                    id={ship.name}
                    className="text-white h3"
                    state={{ from: ship.name }}
                >
                    <strong>{ship.name}</strong>  {/* Название вашего корабля */}
                </Link>
            </div>
            <p className="card-text" style={{ fontSize: '1rem' }}>
                Дата изготовления: {ship.creation_date}  {/* Дата изготовления */}
            </p>
        </div>

        {/* Колонка для полезной нагрузки */}
        <div className="col-md-2 card-body" style={{ fontSize: '1rem' }}>
            <div className="form-group">
                <label className="form-label" >Полезная нагрузка (кг):</label>
                <input
                    placeholder="Введите полезную нагрузку"
                    type="number"
                    className="form-control"
                    style={{ width: "150px" }}  
                    value={Number(local_payload)}
                    onChange={(e) => {
                        console.log("Введённое значение:", e.target.value);
                        setLocal_payload(Number(e.target.value));
                    }}
                    disabled={!editMM}
                />
            </div>
        </div>

        {/* Кнопка изменить */}
        <div className="col-md-1 card-body">
            <Link
                to={`/ships/${ship.id}`} 
                className="btn btn-primary"
                style={{ fontSize: '1rem' }}
            >
                Открыть
            </Link>
        </div>

        {/* Кнопка удалить, если нужно */}
        {showRemoveBtn &&
        <div className="col-md-2 card-body">
            <Button
                color="primary"
                onClick={handleRemoveFromDraftFlight} 
                style={{ fontSize: '1rem' }}
            >
                Удалить
            </Button>
        </div>
        }
    </div>
</div>
    );
};

export default ShipCard;