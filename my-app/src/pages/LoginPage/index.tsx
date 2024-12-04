/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react"
import "./LoginPage.css"
import { useDispatch } from 'react-redux';
import {handleLogin} from "src/store/slices/cookieSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "src/store/store";

  
export const LoginPage : FC = () => {

    const dispatch = useDispatch<AppDispatch>();

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
            navigate("/");
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