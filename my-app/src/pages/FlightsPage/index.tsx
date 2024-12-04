import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store.ts";
import { fetchFlights, T_FlightsFilters, updateFilters } from "src/store/slices/flightsSlice.ts";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Input } from "reactstrap";
import "./FlightsPage.css";
import {Link} from "react-router-dom";

export const FlightsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const flights = useAppSelector((state) => state.flights.flights);
    const isAuthenticated = useAppSelector((state) => state.cookie?.is_authenticated);
    const filters = useAppSelector<T_FlightsFilters>((state) => state.flights.filters);

    const [status, setStatus] = useState(filters.status);
    const [dateFormationStart, setDateFormationStart] = useState(filters.date_formation_start);
    const [dateFormationEnd, setDateFormationEnd] = useState(filters.date_formation_end);

    const statusOptions = {
        0: "Любой",
        2: "В работе",
        3: "Завершен",
        4: "Отклонен",
    };

    // Проверка авторизации
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/403/");
        }
    }, [isAuthenticated, navigate]);

    // Загрузка перелетов
    useEffect(() => {
        dispatch(fetchFlights());
    }, [dispatch]);

    // Применение фильтров
    const applyFilters = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formatDate = (date: string) => {
            if (!date) return null;
            const d = new Date(date);
            return d.toISOString();  // Преобразует в формат YYYY-MM-DDTHH:MM:SS
        };
        const newFilters: T_FlightsFilters = {
            status: status,
            date_formation_start: formatDate(dateFormationStart) || '',
            date_formation_end: formatDate(dateFormationEnd) || '',
        };

        await dispatch(updateFilters(newFilters));
        await dispatch(fetchFlights());
    };

    return (
        <Container>
            <Form onSubmit={applyFilters}>
                <Row className="mb-4 d-flex align-items-center">
                    <Col xs="12" className="mb-3">
                        <label>От</label>
                        <Input
                            type="date"
                            value={dateFormationStart}
                            onChange={(e) => setDateFormationStart(e.target.value)}
                            required
                        />
                    </Col>
                    <Col xs="12" className="mb-3">
                        <label>До</label>
                        <Input
                            type="date"
                            value={dateFormationEnd}
                            onChange={(e) => setDateFormationEnd(e.target.value)}
                            required
                        />
                    </Col>
                    <Col xs="12" className="mb-3">
                        <Form.Group controlId="statusSelect">
                            <Form.Label>Статус</Form.Label>
                            <Form.Control
                                as="select"
                                value={status}
                                onChange={(e) => setStatus(Number(e.target.value))}
                            >
                                {Object.entries(statusOptions).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs="12" className="d-flex justify-content-end">
                        <Button variant="dark" type="submit" className="mt-3">
                            Применить
                        </Button>
                    </Col>
                </Row>
            </Form>

            <div className="table-container">
                {flights.length ? (
                    <table className="flights-table">
                        <thead>
                            <tr>
                                <th>ID Перелета</th>
                                <th>Статус</th>
                                <th>Космодром отправки</th>
                                <th>Космодром прилета</th>
                                <th>Дата запуска</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map((flight, index) => (
                                <tr key={index}>
                                    <td>{flight.id}</td>
                                    <td>{flight.status}</td>
                                    <td>{flight.launch_cosmodrom}</td>
                                    <td>{flight.arrival_cosmodrom}</td>
                                    <td>{flight.estimated_launch_date}</td>
                                    <td>
                                    <Link to={`/flights/${flight.id}`}>
                                        <Button variant="dark" color="dark">
                                            Открыть
                                        </Button>
                                    </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <h3 className="text-center mt-5">Перелеты не найдены</h3>
                )}
            </div>
        </Container>
    );
};