/* eslint-disable react-hooks/exhaustive-deps */

import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
// import {T_Ship} from "src/modules/types.ts";
// import {ShipMocks} from "src/modules/mocks.ts";
import mockImage from "src/assets/mock.png";
import { dest_img } from "../../../target_config"
// import { dest_api } from "../../../target_config"
import { useAppDispatch, useAppSelector } from "src/store/store";
import { fetchShip, removeSelectedShip } from 'src/store/slices/shipsSlice';



const ShipPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const selectedShip = useAppSelector((state) => state.ships.selectedShip)

    const [isMock, setIsMock] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchShip(id));
            setIsMock(false);
        }
        return () => {
            setIsMock(true);
            dispatch(removeSelectedShip())
        };
    }, [id]); // Добавлен id в зависимости useEffect

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