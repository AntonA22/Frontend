import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { T_Ship } from "src/modules/types";
import { store, useAppDispatch } from "src/store/store";
import { fetchShip, updateShip, updateShipImage } from "src/store/slices/shipsSlice";
import { useAppSelector } from "src/store/store";
import { useNavigate } from "react-router-dom";


export const ShipEditPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState<File | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const isModerator = useAppSelector((state) => state.cookie?.is_moderator);

    const [ship, setShip] = useState<T_Ship>({
        id: '', 
        name: '', 
        description: '', 
        creation_date: '', 
        image: '',
        status: 1,
        payload: '', 
    });

    const statusOptions: { [key: string]: string } = {
        "1": "Активно",
        "2": "Удалено",
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchShip(id))
                .unwrap() // unwrap позволяет ловить ошибку, если запрос не удастся
                .then((data) => {
                    const updatedData = { ...data, id: data.id.toString() }; // Преобразуем поле id в строку
                    setShip(updatedData); 
                    console.log(updatedData);
                })
                .catch(() => {
                    console.log("error get ship");
                });
            setIsEdit(true);
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (!isModerator) {
          navigate("/403");
        }
      }, [isModerator, navigate]);

      const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
    
        setShip((prevShip) => ({
            ...prevShip,
            [name]: name === "status" ? parseInt(value) : value, // Преобразуем значение статуса в число, если нужно
        }));
    };
    // Обработчик изменения файла (изображения)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        console.log(file)
        if (file) {
            setImageUrl(file);
            setShip(prevShip => ({
                ...prevShip,
                image: file ? file.name : ship.image
            }));
        }
    };

    const handleSubmit = async () => {
        if (isEdit) {
            try {
                // Убираем URL из имени изображения
                ship.image = ship.image.replace("http://localhost:9000/images/", "");
                console.log("Отправляем данные на сервер:", ship);
    
                // Обновляем текстовые данные
                await store.dispatch(updateShip({ shipId: ship.id?.toString() || "", data: ship }));
                console.log("Данные обновлены");
    
                // Если изображение указано, отправляем запрос на его обновление
                if (imageUrl != null) {
                    console.log("Меняем изображение");
                    const imageFile = new File([imageUrl], ship.image);
                    await store.dispatch(updateShipImage({ shipId: ship.id?.toString() || "", image: imageFile }));
                    console.log("Изображение обновлено");
                }
                navigate("/moderator_ships/")
            } catch (error) {
                console.error("Ошибка при обновлении:", error);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h1>Редактировать корабль</h1>
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
                    <select
                        className="form-control"
                        name="status"
                        value={ship.status.toString()} // Значение должно быть строкой, чтобы соответствовать ключам statusOptions
                        onChange={handleChange}
                    >
                        {Object.entries(statusOptions).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
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
                    <button type="submit" className="btn btn-dark">Сохранить</button>
                </div>
            </form>
        </div>
    );
}

