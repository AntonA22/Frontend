
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container className="text-center mt-5">
            <Row>
                <Col>
                    <h1 className="display-4">404</h1>
                    <p className="lead">Страница не найдена.</p>
                    <Button variant="dark" onClick={() => navigate("/")}>
                        Вернуться на главную
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};