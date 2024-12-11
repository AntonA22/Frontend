import React, { useState, useEffect } from "react";
import "./ModeratorShipsListPage.css";
import { Container } from "react-bootstrap";
import { Link,} from "react-router-dom";
// import { ServiceManagerCard } from "../../components/ServiceManagerCard";
// import { IServiceManagerCardProps } from "../../components/ServiceManagerCard/typing";
import {fetchShips, updateShipName} from "src/store/slices/shipsSlice.ts";
import { useAppDispatch, useAppSelector} from "src/store/store";
import {ChangeEvent, FormEvent} from "react";
import ShipCard from "src/components/Shipcard3/index.tsx";
import { useNavigate } from "react-router-dom";


export const ModeratorShipsListPage = () => {
    // Состояния
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const ships = useAppSelector((state) => state.ships.ships)

    const ship_name = useAppSelector((state) => state.ships.ship_name)

    const isModerator = useAppSelector((state) => state.cookie?.is_moderator)

    const [isPageActive, setisPageActive] = useState(false)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateShipName(e.target.value))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        dispatch(fetchShips({}));
    }

    // Эффект для загрузки данных при монтировании компонента
    useEffect(() => {
        dispatch(fetchShips({}));
        setisPageActive(true);
    }, [])
    
    useEffect(() => {
        if (!isModerator) {
          navigate("/403");
        }
      }, [isModerator, navigate]);

    return (
        <>
        <Container>
            <div className="d-flex flex-column mt-4 mb-4 p-0">
                <div className="m-auto">
                    <h1><strong>Космолеты</strong></h1>
                </div>
                <form onSubmit={handleSubmit} style={{ marginLeft: '35%' }}>
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
            {
                isPageActive ?
                    <>
                        {ships && ships.length > 0 ? (
                            <div className="row">
                                {ships.map((ship) => (
                                    <div key={ship.id} className="col-12">
                                        <ShipCard ship={ship} isMock={false} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Container className="d-flex justify-content-center mt-4 mb-5">
                                <h2>Ничего не найдено</h2>
                            </Container>
                        )}
                    </>
                    :
                    <>
                        
                    </>
            }
            <div className="d-flex justify-content-center">
                <Link to="/add_ship/" className="btn btn-dark">
                    Добавить космолет
                </Link>
            </div>
        </Container>
    </>
    );
};