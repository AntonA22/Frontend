/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShipCard from "../../components/ShipCard2";
import "./FlightPage.css";
import {useAppDispatch, useAppSelector} from "src/store/store.ts";
import {useNavigate} from "react-router-dom";
import {E_FlightStatus} from "src/modules/types.ts";
import {Button, Col, Form, Row} from "reactstrap";
import {
    deleteDraftFlight,
    fetchFlight,
    removeFlight,
    sendDraftFlight,
    triggerUpdateMM,
    updateFlight
} from "src/store/slices/flightsSlice.ts";


export interface Ship {
  id: number;
  name: string;
  image: string; // Ссылка на изображение корабля
  payload: number; // Полезная нагрузка
  creation_date: string
}


export const FlightPage: FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{id: string}>();
    console.log(id)

    const dispatch = useAppDispatch()
    const isAuthenticated = useAppSelector((state) => state.cookie?.is_authenticated)

    const flight = useAppSelector((state) => state.flights.flight)

    const [launch_cosmodrom, setLaunchCosmodrom] = useState<string>(flight?.launch_cosmodrom || '');
    const [arrival_cosmodrom, setArrivalCosmodrom] = useState<string>(flight?.arrival_cosmodrom || '');
    const [estimated_launch_date, setEstimatedLaunchDate] = useState<string>(flight?.estimated_launch_date || '');
    const [result, setResult] = useState<string | null>(flight?.result ? String(flight.result) : '');  // преобразуем в строку// Здесь можно задать значение по умолчанию

    // Получение данных о полете
    useEffect(() => {
    if (!isAuthenticated) {
        navigate("/403/")
    }
    }, [isAuthenticated]);

    useEffect(() => {
        dispatch(fetchFlight(id || ''))
        return () => {
            dispatch(removeFlight());  // Вызываем dispatch без возвращения объекта
        };
    }, []);

    useEffect(() => {
        setLaunchCosmodrom(flight?.launch_cosmodrom || '')
        setArrivalCosmodrom(flight?.arrival_cosmodrom || '')
        setEstimatedLaunchDate(flight?.estimated_launch_date || '')
        setResult(flight?.result ? String(flight.result) : '')
    }, [flight]);

    const sendFlight = async (e: React.FormEvent) => {
        e.preventDefault()

        await saveFlight()

        await dispatch(sendDraftFlight())

        navigate("/flights")
    }

    const saveFlight = async (e?: React.FormEvent) => {
        e?.preventDefault()

        const data = {
            launch_cosmodrom,
            arrival_cosmodrom,
            estimated_launch_date
        }

        await dispatch(updateFlight(data))
        await dispatch(triggerUpdateMM())
    }

    const deleteFlight = async () => {
        await dispatch(deleteDraftFlight())
        navigate("/ships")
    }

    if (!flight) {
        return (
        <div className="container">
            <h3 className="text-center">Загрузка...</h3>
        </div>
        );
    }

    const formatToInputDate = (date: string): string => {
        const parsedDate = new Date(date); // Создаем объект Date
        const year = parsedDate.getFullYear();
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0"); // Месяц (с ведущим нулем)
        const day = parsedDate.getDate().toString().padStart(2, "0"); // День (с ведущим нулем)
    
        return `${year}-${month}-${day}`; // Формат YYYY-MM-DD
    };

    const isDraft = flight.status == E_FlightStatus.Draft
    const isCompleted = flight.status == E_FlightStatus.Completed

    return (
        <Form onSubmit={sendFlight} className="pb-5">
            <main className="container">
            <h3 className="text-center">Детали полета</h3>

            <div className="horizontal-form-group">
                <div className="form-group">
                <label className="form-label">Космодром отправки:</label>
                <input
                    type="text"
                    className="form-control custom-form-control"
                    value={launch_cosmodrom}
                    onChange={(e) => setLaunchCosmodrom(e.target.value)}
                    disabled={!isDraft}
                />
                </div>
                <div className="form-group">
                <label className="form-label">Космодром прилета:</label>
                <input
                    type="text"
                    className="form-control custom-form-control"
                    value={arrival_cosmodrom}
                    onChange={(e) => setArrivalCosmodrom(e.target.value)}
                    disabled={!isDraft}
                />
                </div>
                <div className="form-group last-item">
                <label className="form-label">Предполагаемая дата запуска:</label>
                <input
                    type="date"
                    className="form-control custom-form-control"
                    value={formatToInputDate(estimated_launch_date)}
                    onChange={(e) => setEstimatedLaunchDate(e.target.value)}
                    disabled={!isDraft}
                />
                </div>
                {isCompleted && (
                    <>
                        <label className="form-label">Результат полета</label>
                        <input 
                            value={result ? "Успех" : "Неудача"} 
                            disabled={true} 
                            readOnly 
                            className="form-control" 
                        />
                    </>
                )}
            </div>

            <h4 className="text-center">Космические корабли</h4>

            {flight.ships.length > 0 ? (
                <div className="cards-wrapper d-flex flex-column">
                {flight.ships.map((ship) => (
                     <ShipCard ship={ship} showRemoveBtn={isDraft} editMM={isDraft}/>
                ))}
                </div>
            ) : (
                <p className="text-center">В этом полете нет кораблей.</p>
            )}
            </main>
            {isDraft &&
                <Row className="mt-5">
                    <Col className="d-flex gap-5 justify-content-center">
                        <Button color="dark" className="fs-4" onClick={saveFlight}>Сохранить</Button>
                        <Button color="dark" className="fs-4 submit-btn" type="submit">Отправить</Button>
                        <Button color="dark" className="fs-4" onClick={deleteFlight}>Удалить</Button>
                    </Col>
                </Row>
            }
        </Form>
    );
    };