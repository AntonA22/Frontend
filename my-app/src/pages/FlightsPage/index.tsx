import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store.ts";
import { fetchFlights, T_FlightsFilters, updateFilters } from "src/store/slices/flightsSlice.ts";
import { Button, Col, Container, Form, Row, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Input } from "reactstrap";
import { Link } from "react-router-dom";
import "./FlightsPage.css";
import {updateFlightStatus} from "src/store/slices/flightsSlice";

export const FlightsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const flights = useAppSelector((state) => state.flights.flights);
    const isAuthenticated = useAppSelector((state) => state.cookie?.is_authenticated);
    const isModerator = useAppSelector((state) => state.cookie?.is_moderator)
    const filters = useAppSelector<T_FlightsFilters>((state) => state.flights.filters);

    const [status, setStatus] = useState(filters.status);
    const [user_name, setUserName] = useState(filters.user_name);
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
          navigate("/403");
        }
      }, [isAuthenticated, navigate]);

    // Загрузка перелетов
    useEffect(() => {
        const fetchData = () => {
            dispatch(fetchFlights());
        };
        fetchData();

        // Установка интервала для Short Polling
        const intervalId = setInterval(fetchData, 2000); 

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(intervalId);
    }, [dispatch]);

    // Применение фильтров
    const applyFilters = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formatDate = (date: string) => {
            if (!date) return null;
            const d = new Date(date);
            return d.toISOString().split("T")[0]; // Преобразует в формат YYYY-MM-DDTHH:MM:SS
        };
        const newFilters: T_FlightsFilters = {
            status: status,
            date_formation_start: formatDate(dateFormationStart) || '',
            date_formation_end: formatDate(dateFormationEnd) || '',
            user_name: user_name 
        };
        await dispatch(updateFilters(newFilters));
        await dispatch(fetchFlights());

    };

    const getStatusText = (status?: number) => statusOptions[String(status) as unknown as keyof typeof statusOptions] || "Неизвестный статус";

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";  
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU"); // Формат: день.месяц.год
    };

    const handleStatusChange = async (flightId: string, newStatus: number) => {
        const flight = flights.find(f => f.id === flightId); // Ищем рейс по ID
        if (!flight) {
            console.error("Рейс не найден");
            return; // Выход из функции, если рейс не найден
        }
        
        // Если статус изменился, отправляем запрос на обновление
        if (newStatus !== flight.status) {
            await dispatch(updateFlightStatus({ flightId, status: newStatus }));
        }
    };

    return (
        <Container fluid className="p-0">
        <Row className="d-flex w-100">
          <Col xs={12} className="d-flex justify-content-start">
            <Form onSubmit={applyFilters} className="w-100">
              <Row className="mb-4 d-flex align-items-center">
                <Col xs="12" className="mb-3">
                  <label>От</label>
                  <Input
                    type="date"
                    value={dateFormationStart}
                    onChange={(e) => setDateFormationStart(e.target.value)}

                  />
                </Col>
                <Col xs="12" className="mb-3">
                  <label>До</label>
                  <Input
                    type="date"
                    value={dateFormationEnd}
                    onChange={(e) => setDateFormationEnd(e.target.value)}
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
                {isModerator &&
                    <Col xs="12" className="mb-3">
                    <label>Пользователь</label>
                    <Input
                        type="text"
                        value={user_name}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    </Col>
                }
                <Col xs="12" className="d-flex justify-content-end">
                  <Button variant="dark" type="submit" className="mt-3">
                    Применить
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      
        <div className="flights-container w-100 justify-content-start">
    {/* Заголовки */}
    <Card className="mb-2 w-100">
      <Card.Body className="py-2 px-3">
        <Row className="d-flex align-items-center">
          <Col xs={12} sm={2} className="flight-col col-fixed">
            <strong>ID Перелета Пользователь</strong>
          </Col>
          <Col xs={12} sm={2} className="flight-col" style={{ display: 'flex', alignItems: 'center', gap: '5px', width: '201px' }}>
            <strong>Статус</strong>
          </Col>
          <Col xs={12} sm={2} className="flight-col">
            <strong>Дата формирования</strong>
          </Col>
          <Col xs={12} sm={2} className="flight-col">
            <strong>Космодром отправки</strong>
          </Col>
          <Col xs={12} sm={2} className="flight-col">
            <strong>Космодром прилета</strong>
          </Col>
          <Col xs={12} sm={2} className="flight-col col-fixed2">
            <strong>Результат полета</strong>
          </Col>
          <Col xs={12} sm={2}></Col>
        </Row>
      </Card.Body>
    </Card>

    {/* Данные */}
    {flights.length ? (
      flights.map((flight) => (
        <Card key={flight.id} className="mb-2 w-100">
          <Card.Body className="py-2 px-3">
            <Row className="d-flex align-items-center">
              {!isModerator ? (
                <div className="col-fixed">
                  <Card.Text>
                    <Link to={"/flights/" + flight.id} className="text-white">
                      {flight.id}
                    </Link>
                    {" "}{flight.owner}
                  </Card.Text>
                </div>
              ) : (
                <Col xs={12} sm={2} className="flight-col col-fixed">
                  {flight.id}
                  {" "}{flight.owner}
                </Col>
              )}
              {isModerator ? (
                    <Form.Group controlId="statusSelect" style={{ display: 'flex', alignItems: 'center', gap: '5px', width: '201px' }}>
                        <Form.Control
                        as="select"
                        value={flight.status}
                        style={{width: '101px'}}
                        disabled
                        >
                        {Object.entries(statusOptions).map(([key, value]) => (
                            <option key={key} value={key}>
                            {value}
                            </option>
                        ))}
                        </Form.Control>
                        {flight.status !== 3 && flight.status !== 4 && (
                            <>
                                <button 
                                    type="button" 
                                    style={{ background: 'black', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}
                                    onClick={() => handleStatusChange(flight.id, 3) } // Обработчик нажатия
                                >
                                    ✓
                                </button>
                                
                                <button 
                                    type="button" 
                                    style={{ background: 'black', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}
                                    onClick={() => handleStatusChange(flight.id, 4) } // Обработчик нажатия
                                >
                                    ✕
                                </button>
                            </>
                        )}
                    </Form.Group>
                    
                ) : (
                    <Col xs={12} sm={2} className="flight-col">
                    {getStatusText(flight.status)}
                    </Col>
              )}
              <Col xs={12} sm={2} className="flight-col">
                {formatDate(flight.date_formation)}
              </Col>
              <Col xs={12} sm={2} className="flight-col">
                {flight.launch_cosmodrom}
              </Col>
              <Col xs={12} sm={2} className="flight-col">
                {flight.arrival_cosmodrom}
              </Col>
              <Col xs={12} sm={2} className="flight-col col-fixed2">
                {flight.result !== null
                  ? flight.result
                    ? "Успех"
                    : "Неудача"
                  : "Нет данных"}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))
    ) : (
      <h3 className="text-center mt-5">Перелеты не найдены</h3>
    )}
  </div>
      </Container>
    );
};