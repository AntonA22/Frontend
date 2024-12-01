import {Container} from "reactstrap";
import {T_Ship} from "src/modules/types.ts";
import ShipCard from "src/components/ShipCard/index.tsx";
import {ShipMocks} from "src/modules/mocks.ts";
import {ChangeEvent, FormEvent, useEffect} from "react";
import * as React from "react";
import {useDispatch} from "react-redux";
// import {useAppSelector} from "src/store/store.ts";
import {updateShipName, useTitle} from "src/store/slices/shipsSlice.ts";
import './shipslistpage.css';
import { dest_api } from "../../../target_config"

interface ShipsListPageProps {
    ships: T_Ship[];
    setShips: (ships: T_Ship[]) => void;
    isMock: boolean;
    setIsMock: (mock: boolean) => void;
  }

const ShipsListPage: React.FC<ShipsListPageProps> = ({ ships, setShips, isMock, setIsMock }) => {

    const dispatch = useDispatch()

    const ship_name = useTitle()

    const get_Data = async () => {

        const url = dest_api !== "api" 
            ? `${dest_api}/ships/?ship_name=${ship_name.toLowerCase()}` 
            : `/${dest_api}/ships/?ship_name=${ship_name.toLowerCase()}`;
        try {
            const response = await fetch(url);
            const results  = await response.json();
            console.log(ships);
            const currentHost = window.location.hostname;
            if (Array.isArray(ships)) {
                results.ships = results.ships.map((ship: { image: string }) => {
                    if (ship.image) {
                        ship.image = ship.image.replace('localhost', currentHost);
                    }
                    return ship;
                });
            } else {
                console.warn('Ships is not an array:', results.ships);
            }

            setShips(results.ships);
            setIsMock(false);
        } catch {
            get_Mocks();
        }
    }

    const get_Mocks = () => {
        setIsMock(true)
        setShips(ShipMocks.filter(ship => ship.name.toLowerCase().includes(ship_name.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        if (isMock) {
            get_Mocks()
        } else {
            await get_Data()
        }
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateShipName(e.target.value))
    }

    useEffect(() => {
        get_Data()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            <div className="row mb-5" style={{ paddingLeft: "65px" }}>
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <div className="row align-items-center">
                        <div className=" col-6 col-md-8 mb-2 mb-md-0">
                            <input 
                                value={ship_name} 
                                onChange={handleChange} 
                                placeholder="Введите название:" 
                                className="form-control search-input"
                            />
                        </div>
                        <div className="col-6 col-md-4 d-flex justify-content-md-start">
                            <button 
                                type="submit" 
                                className="btn btn-primary search-btn"
                            >
                                Поиск
                            </button>
                        </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="row">
                {ships?.map((ship) => (
                    <div key={ship.id} className="col-sm-12 col-md-6 col-lg-4">
                    <ShipCard ship={ship} isMock={isMock} />
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default ShipsListPage