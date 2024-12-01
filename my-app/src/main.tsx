
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter} from "react-router-dom";
import {store} from "src/store/store.ts";
import {Provider} from "react-redux";
import { dest_root } from "../target_config.ts";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={dest_root}>
      <Provider store={store} >
          <App />
      </Provider>
  </BrowserRouter>
)

if ("serviceWorker" in navigator) {
window.addEventListener("load", function() {
  navigator.serviceWorker
    .register("serviceWorker.js")
    .then(() => console.log("service worker registered"))
    .catch(err => console.log("service worker not registered", err))
})
}