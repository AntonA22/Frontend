/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "./components/Header";
import {Breadcrumbs} from "./components/Breadcrumbs";
import ShipPage from "./pages/ShipPage";
import ShipsListPage from "./pages/ShipsListPage";
import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import "./styles.css"
import { RegistrationPage } from "./pages/RegistrationPage";
import { LoginPage } from "./pages/LoginPage";
import { FlightPage } from "./pages/FlightPage";
import { ProfilePage } from "./pages/ProfilePage";
import {useAppDispatch, useAppSelector} from "src/store/store.ts";
import {handleCheck} from "src/store/slices/cookieSlice";
import { FlightsPage } from "./pages/FlightsPage";

function App() {

    const dispatch = useAppDispatch()

    const {checked} = useAppSelector((state) => state.cookie)

    useEffect(() => {
      dispatch(handleCheck())
      if (typeof window !== 'undefined' && (window as any).__TAURI__?.tauri) {
        const { invoke } = (window as any).__TAURI__.tauri;
        
        invoke('tauri', { cmd: 'create' })
          .then((response: any) => console.log(response))
          .catch((error: any) => console.log(error));

        return () => {
          invoke('tauri', { cmd: 'close' })
            .then((response: any) => console.log(response))
            .catch((error: any) => console.log(error));
        };
      }
    }, []);

    if (!checked) {
      return <></>
    }

    return (
        <div>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs />
                </Row>
                <Row>
                    <Routes>
						            <Route path="/" element={<HomePage />} />
                        <Route path="/ships/" element={<ShipsListPage/>} />
                        <Route path="/ships/:id" element={<ShipPage/>} />
                        <Route path={"/register"} element={<RegistrationPage />} />
                        <Route path={"/login"} element={<LoginPage />} />
                        <Route path="/flights/:id" element={<FlightPage/>} />
                        <Route path="/profile/" element={<ProfilePage />} />
                        <Route path="/flights/" element={<FlightsPage />} />
                        {/* <Route path="/flights/" element={<FlightsPage />} />
                        <Route path="/profile/" element={<ProfilePage />}
                        <Route path="/403/" element={<AccessDeniedPage />} />
                        <Route path="/404/" element={<NotFoundPage />} /> */}
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App