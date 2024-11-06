import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {T_Ship} from "src/modules/types.ts";
import ShipCard from "src/components/ShipCard/index.tsx";
import {ShipMocks} from "src/modules/mocks.ts";
import {FormEvent, useEffect} from "react";
import * as React from "react";

interface ShipsListPageProps {
    ships: T_Ship[];
    setShips: (ships: T_Ship[]) => void;
    isMock: boolean;
    setIsMock: (mock: boolean) => void;
    shipName: string;
    setShipName: (name: string) => void;
  }

const ShipsListPage: React.FC<ShipsListPageProps> = ({ ships, setShips, isMock, setIsMock, shipName, setShipName }) => {
    const get_Data = async () => {
        const url = `/api/ships/?ship_name=${shipName.toLowerCase()}`;
        const options = {
            signal: AbortSignal.timeout(1000)
        };

        try {
            const response = await fetch(url, options);
            const { ships } = await response.json();
            setShips(ships);
            setIsMock(false);
        } catch {
            get_Mocks();
        }
    }

    const get_Mocks = () => {
        setIsMock(true)
        setShips(ShipMocks.filter(ship => ship.name.toLowerCase().includes(shipName.toLowerCase())))
    }

    const search_function = async (e:FormEvent) => {
        e.preventDefault()
        if (isMock) {
            get_Mocks()
        } else {
            await get_Data()
        }
    }

    useEffect(() => {
        get_Data()
    }, []);

    return (
        <Container>
            <Row className="mb-5" style={{ paddingLeft: "65px" }}>
                <Col md="6">
                    <Form onSubmit={search_function}>
                        <Row>
                            <Col md="8">
                                <Input value={shipName} onChange={(e) => setShipName(e.target.value)} placeholder="Введите название:"></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                {ships?.map(ship => (
                    <Col key={ship.id} xs="4">
                        <ShipCard ship={ship} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ShipsListPage