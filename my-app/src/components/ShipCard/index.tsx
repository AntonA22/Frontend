import {Button, Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import mockImage from "src/assets/mock.png";
import {Link} from "react-router-dom";
import {T_Ship} from "modules/types.ts";

interface ShipCardProps {
    ship: T_Ship,
    isMock: boolean
}

const ShipCard: React.FC<ShipCardProps> = ({ ship, isMock }) => {
    return (
        <Card key={ship.id} style={{width: '18rem', margin: "0 auto 50px", height: "calc(100% - 50px)" }}>
            <CardImg
                src={isMock ? mockImage as string : ship.image}
                style={{"height": "300px"}}
            />
            <CardBody className="d-flex flex-column justify-content-between">
                <CardTitle tag="h5">
                    {ship.name}
                </CardTitle>
                <CardText>
                    Дата изготовления: {ship.creation_date}
                </CardText>
                <Link to={`/ships/${ship.id}`}>
                    <Button color="primary">
                        Открыть
                    </Button>
                </Link>
            </CardBody>
        </Card>
    );
};

export default ShipCard