import {Link} from "react-router-dom";
import {Button} from "reactstrap";
import "./bin.css"; 

type Props = {
    isActive: boolean,
    draft_flight_id: string,
    ships_count: number
}

export const Bin = ({isActive, draft_flight_id, ships_count}:Props) => {

    if (!isActive) {
        return <Button color={"secondary"} className="bin-wrapper" disabled>Корзина</Button>
    }

    return (
        <Link to={`/flights/${draft_flight_id}/`} className="bin-wrapper">
            <Button className="btn btn-primary search-btn">
                Корзина
                <span className="badge-count">
                    {ships_count}
                </span>
            </Button>
        </Link>
    )
}