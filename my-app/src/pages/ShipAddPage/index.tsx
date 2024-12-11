import {  useState, useEffect } from "react";
import { T_Ship } from "src/modules/types";
import { useAppDispatch } from "src/store/store";
import { createShip, updateShipImage } from "src/store/slices/shipsSlice";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/store/store";

export const ShipAddPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState<File | null>(null);

    const isModerator = useAppSelector((state) => state.cookie?.is_moderator);

    const statusOptions: { [key: string]: string } = {
        "1": "Активно",
        "2": "Удалено",
    };


    const [ship, setShip] = useState<T_Ship>({
        id: '', 
        name: '', 
        description: '', 
        creation_date: '', 
        image: '',
        status: 1,
        payload: '', 
    });

    useEffect(() => {
        if (!isModerator) {
          navigate("/403");
        }
      }, [isModerator, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setShip(prevShip => ({
            ...prevShip,
            [name]: value,
        }));
    };


    // Обработчик изменения файла (изображения)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        console.log(file);
        if (file) {
            setImageUrl(file);
            setShip(prevShip => ({
                ...prevShip,
                image: file ? file.name : ship.image
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            // Отправляем данные корабля на сервер
            console.log("Отправляем данные на сервер:", ship);
            const newShip = await dispatch(createShip(ship)).unwrap();
            console.log("Корабль успешно создан:", newShip);

            // Если изображение указано, отправляем запрос на его обновление
            if (imageUrl != null) {
                console.log("Меняем изображение");
                const imageFile = new File([imageUrl], ship.image);
                await dispatch(updateShipImage({ shipId: newShip.id.toString(), image: imageFile }));
                console.log("Изображение обновлено");
            }
            navigate("/moderator_ships/")
        } catch (error) {
            console.error("Ошибка при создании корабля:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1>Создать новый корабль</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="mb-3">
                    <label className="form-label">Название корабля</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={ship.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Описание</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={ship.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Дата изготовления:</label>
                    <input
                        type="date"
                        className="form-control"
                        name="creation_date"
                        value={ship.creation_date}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Статус</label>
                    <input
                        type="text"
                        className="form-control"
                        name="status"
                        value={statusOptions[ship.status.toString()]}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Изображение</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="mb-3">
                    <button type="submit" className="btn btn-dark">Создать</button>
                </div>
            </form>
        </div>
    );
};