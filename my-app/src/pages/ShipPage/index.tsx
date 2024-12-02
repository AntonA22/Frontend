import * as React from 'react';
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {T_Ship} from "src/modules/types.ts";
import {ShipMocks} from "src/modules/mocks.ts";
import mockImage from "src/assets/mock.png";
import { dest_img } from "../../../target_config"
import { dest_api } from "../../../target_config"

interface ShipPageProps {
    selectedShip: T_Ship | null;
    setSelectedShip: (ship: T_Ship | null) => void;
    isMock: boolean;
    setIsMock: (mock: boolean) => void;
}

const ShipPage: React.FC<ShipPageProps> = ({ selectedShip, setSelectedShip, isMock, setIsMock }) => {
    const { id } = useParams<{id: string}>();

    const get_data = async () => {
        const url = dest_api !== "api" 
            ? `${dest_api}/ships/${id}/` 
            : `/api/ships/${id}/`;

        try {
            const response = await fetch(url);
            const shipData = await response.json();
            setSelectedShip(shipData);
        } catch {
            get_Mock();
        }
    }

    const get_Mock = () => {
        setIsMock(true)
        setSelectedShip(ShipMocks.find(ship => ship?.id == parseInt(id as string)) as T_Ship)
    }

    useEffect(() => {
        if (!isMock) {
            get_data()
        } else {
            get_Mock()
        }

        return () => setSelectedShip(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!selectedShip) {
        return (
            <div>

            </div>
        )
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <img
                        alt=""
                        src={dest_img === "img-proxy" 
                            ? (isMock ? mockImage as string : selectedShip.image) 
                            : selectedShip.image.replace("localhost", "172.20.10.11")}
                        className="w-100"
                    />
                </div>
                <div className="col-md-6">
                    <h1 className="mb-3">{selectedShip.name}</h1>
                    <p className="fs-5">Описание: {selectedShip.description}</p>
                    <p className="fs-5">Дата изготовления: {selectedShip.creation_date}.</p>
                </div>
            </div>
        </div>
    );
};

export default ShipPage