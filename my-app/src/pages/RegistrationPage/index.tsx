import { FC, useState, useEffect } from "react";
import "./RegistrationPage.css"
import { api } from "../../api";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/store/store";


export const RegistrationPage: FC = () => {

    const [ error, setError ] = useState(false)
    const navigate = useNavigate();

    const isAuthenticated = useAppSelector((state) => state.cookie?.is_authenticated);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
      });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Регистрация:', formData);
        api.users.usersRegisterCreate( formData )
            .then (() =>  navigate("/ships"))
            .catch (() => setError(true))
             
    };

    useEffect(() => {
        console.log(isAuthenticated)
        if (isAuthenticated) {
          navigate("/403");
        }
      }, [isAuthenticated, navigate]);

    return (

        <>

        {/* <MyOwnHeader /> */}

        <div className="RegistrationPage">
            <form onSubmit={handleSubmit}>
                <h1>Регистрация</h1>
                <div className="form-group">
                <label htmlFor="username">Логин:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    maxLength={150}
                />
                </div>
                <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={254}
                />
                </div>
                <div className="form-group">
                <label htmlFor="first_name">Имя:</label>
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    maxLength={150}
                />
                </div>
                <div className="form-group">
                <label htmlFor="last_name">Фамилия:</label>
                <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    maxLength={150}
                />
                </div>
                <div className="form-group">
                <label htmlFor="password">Пароль:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    maxLength={128}
                />
                </div>
                { error && <h1> Ошибка в регистрации </h1>}
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>



        </>

    )

}