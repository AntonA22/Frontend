import {useAppDispatch, useAppSelector} from "src/store/store.ts";
import {Button, Form} from "reactstrap";
import {FormEvent,  useState, useEffect} from "react";
import {handleUpdateProfile, setValidationError} from "src/store/slices/cookieSlice";

export const ProfilePage = () => {

    const { username = "", email = "", first_name = "", last_name = "", validation_error } = useAppSelector((state) => state.cookie);

    const [inputUsername, setInputUsername] = useState(username)

    const [inputEmail, setInputEmail] = useState(email)

    const [inputPassword, setInputPassword] = useState("")

    const [input_first_name, setInput_first_name] = useState(first_name)
    const [input_last_name, setInput_last_name] = useState(last_name)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setValidationError(false))
    }, [inputUsername, inputEmail, inputPassword]);


    const handleSaveProfile = async (e:FormEvent) => {
        dispatch(setValidationError(false)); 
        e.preventDefault()

        if (validation_error){
            return
        }

        const data = {
            username: inputUsername,
            email: inputEmail,
            password: inputPassword,
            first_name: input_first_name,  // добавьте сюда реальные данные, если это нужно
            last_name: input_last_name    // добавьте сюда реальные данные, если это нужно
        }
        console.log("Отправка данных на сервер:", data);
        dispatch(handleUpdateProfile(data));
        
    }
    return (
        <div className="d-flex justify-content-center" style={{ height: '100vh', marginTop: '50px' }}>
            <Form onSubmit={handleSaveProfile} className="w-25">
                <div className="form-group">
                    <label htmlFor="username">Логин</label>
                    <input
                        id="username"
                        type="text"
                        className="form-control"
                        value={inputUsername}
                        onChange={(e) => setInputUsername(e.target.value)}
                        required={false}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Почта</label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        required={false}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Имя</label>
                    <input
                        id="input_first_name"
                        type="text"
                        className="form-control"
                        value={input_first_name}
                        onChange={(e) => setInput_first_name(e.target.value)}
                        required={false}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Фамилия</label>
                    <input
                        id="input_last_name"
                        type="text"
                        className="form-control"
                        value={input_last_name}
                        onChange={(e) => setInput_last_name(e.target.value)}
                        required={false}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        placeholder="Введите новый пароль"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                        required={false}
                    />
                    {validation_error &&  (
                        <small className="text-danger">Введены некорректные данные</small>
                    )}
                </div>

                <Button type="submit" color="dark" className="mt-3">Сохранить</Button>
            </Form>
        </div>
    )
}