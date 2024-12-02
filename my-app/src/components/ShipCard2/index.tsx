import React from "react";
import mockImage from "src/assets/mock.png";
import { Ship } from "src/pages/FlightPage/index.tsx";
import { dest_img } from "../../../target_config";
import "./ShipCard2.css";
import {Link} from "react-router-dom";
import {Button} from "reactstrap";


interface ShipCardProps {
  ship: Ship;
  isMock: boolean;
}

const ShipCard: React.FC<ShipCardProps> = ({ ship, isMock }) => {
  // Определяем URL изображения
  const imageUrl =
    dest_img === "img-proxy"
      ? isMock
        ? (mockImage as string)
        : ship.image
      : ship.image.replace("localhost", "172.20.10.11");

  return (
    <div className="card w-100 mb-5 custom-card">
      <div className="row g-0">
        <div className="col-md-6 d-flex justify-center custom-height-img">
          <img src={imageUrl} alt={ship.name} className="img-fluid" style={{ height: "300px" }} />
        </div>
        <div className="col-md-6 custom-inf-card-style">
          <div className="card-body d-flex flex-column justify-content-between">
            <h5 className="card-title">{ship.name}</h5>
            <p className="card-text">Дата изготовления: {ship.creation_date}</p>
            <div className="form-group">
              <label className="form-label">Полезная нагрузка (кг):</label>
              <input
                placeholder="Введите полезную нагрузку"
                disabled
                type="number"
                className="form-control"
                style={{ width: "255px" }}
                value={25} // Здесь можно заменить значение на `ship.value` при необходимости
              />
            </div>
            <Link to={`/ships/${ship.id}`}>
                    <Button color="primary">
                        Открыть
                    </Button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipCard;