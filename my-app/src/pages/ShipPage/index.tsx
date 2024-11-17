import * as React from 'react';
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {T_Ship} from "src/modules/types.ts";
import {Col, Container, Row} from "reactstrap";
import {ShipMocks} from "src/modules/mocks.ts";
import mockImage from "src/assets/mock.png";

interface ShipPageProps {
    selectedShip: T_Ship | null;
    setSelectedShip: (ship: T_Ship | null) => void;
    isMock: boolean;
    setIsMock: (mock: boolean) => void;
}

const ShipPage: React.FC<ShipPageProps> = ({ selectedShip, setSelectedShip, isMock, setIsMock }) => {
    const { id } = useParams<{id: string}>();

    const get_data = async () => {
        const url = `/api/ships/${id}`;
        const options = {
            signal: AbortSignal.timeout(1000)
        };
        try {
            const response = await fetch(url, options);
            const shipData = await response.json();
            setSelectedShip(shipData);
        } catch {
            get_Mock();
        }
    }

    const get_Mock = () => {
        setIsMock(true)
        setSelectedShip(ShipMocks.find(ship => ship?.id == parseInt(id as string)) as T_Ship)
    }

    useEffect(() => {
        if (!isMock) {
            get_data()
        } else {
            get_Mock()
        }

        return () => setSelectedShip(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!selectedShip) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md="6">
                    <img
                        alt=""
                        src={isMock ? mockImage as string : selectedShip.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedShip.name}</h1>
                    <p className="fs-5">Описание: {selectedShip.description}</p>
                    <p className="fs-5">Дата изготовления: {selectedShip.creation_date}.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default ShipPage