import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShipCard from "../../components/ShipCard2";
import { api } from "../../api";
import "./FlightPage.css";

export interface Ship {
  id: number;
  name: string;
  image: string; // Ссылка на изображение корабля
  payload: number; // Полезная нагрузка
  creation_date: string
}

export interface Flight {
  id: number;
  ships: Ship[];
  owner: string;
  moderator: string | null;
  status: number;
  date_created: string;
  date_formation: string | null;
  date_complete: string | null;
  launch_cosmodrom: string | null;
  arrival_cosmodrom: string | null;
  estimated_launch_date: string | null;
  result: boolean | null;
}

export const FlightPage: FC = () => {
  const { id_flight } = useParams();
  const [flight, setFlight] = useState<Flight | null>(null); // Изменено на Flight
  const [error, setError] = useState<string | null>(null); // Добавлена обработка ошибки

  // Получение данных о полете
  const getFlightDetails = async () => {
    try {
      const { data } = await api.flights.flightsRead(String(id_flight));

      // Преобразуем данные API, чтобы они соответствовали интерфейсу Flight
      const formattedData: Flight = {
        id: data.id || 0,
        moderator: data.moderator || "",
        owner: data.owner || "",
        date_created: data.date_created || "",
        date_complete: data.date_complete || "",
        date_formation: data.date_formation || "",
        estimated_launch_date: data.estimated_launch_date || "",
        launch_cosmodrom: data.launch_cosmodrom || "",
        arrival_cosmodrom: data.arrival_cosmodrom || "",
        status: data.status || 0,
        result: data.result || null,
        // Проверка, что ships — это массив
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ships: Array.isArray(data.ships) ? data.ships.map((ship: any) => ({
          id: ship.id,
          name: ship.name,
          image: ship.image,  // Ссылка на изображение корабля
          payload: ship.payload,
          creation_date:  ship.creation_date
        })) : [], // если ships не массив, вернуть пустой массив
      };

      setFlight(formattedData);
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
      setError("Не удалось загрузить данные полета."); // Установка сообщения об ошибке
    }
  };

  useEffect(() => {
    getFlightDetails();
  }, [id_flight]);

  if (error) {
    return (
      <div className="container">
        <h3 className="text-center">Ошибка</h3>
        <p className="text-center">{error}</p>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="container">
        <h3 className="text-center">Загрузка...</h3>
      </div>
    );
  }

  return (
    <main className="container">
      <h3 className="text-center">Детали полета</h3>

      <div className="horizontal-form-group">
        <div className="form-group">
          <label className="form-label">Космодром отправки:</label>
          <input
            type="text"
            className="form-control custom-form-control"
            value={flight.launch_cosmodrom || ""}
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="form-label">Космодром прилета:</label>
          <input
            type="text"
            className="form-control custom-form-control"
            value={flight.arrival_cosmodrom || ""}
            readOnly
          />
        </div>
        <div className="form-group last-item">
          <label className="form-label">Предполагаемая дата запуска:</label>
          <input
            type="text"
            className="form-control custom-form-control"
            value={flight.estimated_launch_date || ""}
            readOnly
          />
        </div>
      </div>

      <h4 className="text-center">Космические корабли</h4>

      {flight.ships.length > 0 ? (
        <div className="cards-wrapper d-flex flex-column">
          {flight.ships.map((ship) => (
            <ShipCard key={ship.id} ship={ship} isMock={false} />
          ))}
        </div>
      ) : (
        <p className="text-center">В этом полете нет кораблей.</p>
      )}
    </main>
  );
};