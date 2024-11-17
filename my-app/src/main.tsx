import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter} from "react-router-dom";
import {store} from "src/store/store.ts";
import {Provider} from "react-redux";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename="/Frontend">
        <Provider store={store} >
            <App />
        </Provider>
    </BrowserRouter>
)
