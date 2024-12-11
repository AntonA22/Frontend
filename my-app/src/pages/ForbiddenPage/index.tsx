
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const ForbiddenPage = () => {
    const navigate = useNavigate();

    return (
        <Container className="text-center mt-5">
            <Row>
                <Col>
                    <h1 className="display-4">403</h1>
                    <p className="lead">Доступ запрещен. У вас нет прав для просмотра этой страницы.</p>
                    <Button variant="dark" onClick={() => navigate("/")}>
                        Вернуться на главную
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};