/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState, useEffect } from "react"
import "./LoginPage.css"
import { useDispatch } from 'react-redux';
import {handleLogin} from "src/store/slices/cookieSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, store } from "src/store/store.ts";

  
export const LoginPage : FC = () => {

    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector((state) => state.cookie?.is_authenticated);

    const [ error, setError ] = useState(false)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
      if (isAuthenticated) {
        navigate("/403");
      }
    }, [isAuthenticated, navigate]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Данные для отправки
        const data = {
          username: formData.username,
          password: formData.password,
        };
    
        try {
          const result = await dispatch(handleLogin(data));
    
          if (result.type === "login/fulfilled") {
            // Получение текущего состояния пользователя
            const state = store.getState(); 
            const isModerator = state.cookie.is_moderator; 
      
            if (isModerator) {
              navigate("/moderator_ships/");
            } else {
              navigate("/"); 
            }
          } else {
            setError(true); 
          }
        } catch (err) {
          setError(true);
        }
      };
    

    return (
        <>

        <div className="LoginPage">

        <form onSubmit={handleSubmit}>
        <h1>Войти</h1>
          <div className="form-group">
            <label htmlFor="username">Логин:</label>
            <input type="text" id="username" name="username" required 
            value = {formData.username}
            onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input type="password" id="password" name="password" required 
            value = {formData.password}
            onChange={handleChange}
            />
          </div>
          { error && <h2> Ошибка входа  </h2> }
          <button type="submit">Войти</button>
        </form>
      </div>

      </>

    )

} 