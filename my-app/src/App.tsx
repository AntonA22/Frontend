/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState} from "react";
import Header from "./components/Header";
import Breadcrumbs from "./components/Breadcrumbs";
import ShipPage from "./pages/ShipPage";
import ShipsListPage from "./pages/ShipsListPage";
import {Route, Routes} from "react-router-dom";
import {T_Ship} from "src/modules/types.ts";
import {Container, Row} from "reactstrap";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import "./styles.css"

function App() {
    useEffect(() => {
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

    const [ships, setShips] = useState<T_Ship[]>([])

    const [selectedShip, setSelectedShip] = useState<T_Ship | null>(null)

    const [isMock, setIsMock] = useState(false);

    return (
        <div>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedShip={selectedShip} />
                </Row>
                <Row>
                    <Routes>
						            <Route path="/" element={<HomePage />} />
                        <Route path="/ships/" element={<ShipsListPage ships={ships} setShips={setShips} isMock={isMock} setIsMock={setIsMock}/>} />
                        <Route path="/ships/:id" element={<ShipPage selectedShip={selectedShip} setSelectedShip={setSelectedShip} isMock={isMock} setIsMock={setIsMock}/>} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App