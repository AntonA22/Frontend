import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {T_Ship} from "src/modules/types.ts";
import ShipCard from "src/components/ShipCard/index.tsx";
import {ShipMocks} from "src/modules/mocks.ts";
import {ChangeEvent, FormEvent, useEffect} from "react";
import * as React from "react";
import {useDispatch} from "react-redux";
import {useAppSelector} from "src/store/store.ts";
import {updateShipName} from "src/store/slices/shipsSlice.ts";

interface ShipsListPageProps {
    ships: T_Ship[];
    setShips: (ships: T_Ship[]) => void;
    isMock: boolean;
    setIsMock: (mock: boolean) => void;
  }

const ShipsListPage: React.FC<ShipsListPageProps> = ({ ships, setShips, isMock, setIsMock }) => {

    const dispatch = useDispatch()

    const {ship_name} = useAppSelector((state) => state.ships)

    const get_Data = async () => {

        const url = `/api/ships/?ship_name=${ship_name.toLowerCase()}`;
        try {
            const response = await fetch(url);
            const { ships } = await response.json();
            setShips(ships);
            setIsMock(false);
        } catch {
            get_Mocks();
        }
    }

    const get_Mocks = () => {
        setIsMock(true)
        setShips(ShipMocks.filter(ship => ship.name.toLowerCase().includes(ship_name.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        if (isMock) {
            get_Mocks()
        } else {
            await get_Data()
        }
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateShipName(e.target.value))
    }

    useEffect(() => {
        get_Data()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            <Row className="mb-5" style={{ paddingLeft: "65px" }}>
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs="8">
                                <Input value={ship_name} onChange={handleChange} placeholder="Введите название:"></Input>
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
                    <Col key={ship.id} sm="12" md="6" lg="4">
                        <ShipCard ship={ship} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ShipsListPage