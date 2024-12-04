/* eslint-disable react-hooks/exhaustive-deps */
import {Container} from "reactstrap";
import ShipCard from "src/components/ShipCard/index.tsx";
import {ChangeEvent, FormEvent, useEffect} from "react";
// import {useAppSelector} from "src/store/store.ts";
import './shipslistpage.css';

import {fetchShips, updateShipName} from "src/store/slices/shipsSlice.ts";
import {useState} from "react";
import Bin from "src/components/Bin";
import { useAppDispatch, useAppSelector} from "src/store/store";



const ShipsListPage = () => {

    const dispatch = useAppDispatch()

    const ships = useAppSelector((state) => state.ships.ships)

    const isAuthenticated = useAppSelector((state) => state.cookie?.is_authenticated)

    const {draft_flight_id, ships_count} = useAppSelector((state) => state.flights)

    const hasDraft = draft_flight_id != null

    const ship_name = useAppSelector((state) => state.ships.ship_name)

    const [isMock, setIsMock] = useState(false);

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        dispatch(fetchShips({}));
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateShipName(e.target.value))
    }

    useEffect(() => {
        dispatch(fetchShips({}));
        setIsMock(false);
        return () => {
            setIsMock(true);
        };
    }, [])


    return (
        <Container>
            <div className="row mb-5" style={{ paddingLeft: "65px" }}>
                <div className="col-md-8">
                    <form onSubmit={handleSubmit}>
                        <div className="row align-items-center">
                            <div className="col-6 col-md-8 mb-2 mb-md-0">
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
    
                <div className="col-md-4 d-flex justify-content-end align-items-center">
                    {isAuthenticated && (
                        <Bin 
                            isActive={hasDraft} 
                            draft_flight_id={draft_flight_id !== null ? draft_flight_id.toString() : ''} 
                            ships_count={ships_count ?? 0}
                        />
                    )}
                </div>
            </div>
    
            <div className="row">
                {ships?.map((ship) => (
                    <div key={ship.id} className="col-sm-12 col-md-6 col-lg-4">
                        <ShipCard ship={ship} showAddBtn={isAuthenticated} isMock={isMock} />
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default ShipsListPage