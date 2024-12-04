export type T_Ship = {
    id: string
    name: string
    description: string
    creation_date: number
    image: string
    status: number
    payload: string
}

export type T_Flight = {
    id: string | null
    status: E_FlightStatus
    date_complete: string
    date_created: string
    date_formation: string
    owner: string
    moderator: string
    ships: T_Ship[]
    launch_cosmodrom: string,
    arrival_cosmodrom: string,
    estimated_launch_date: string,
    result?: boolean
}

export enum E_FlightStatus {
    Draft=1,
    InWork,
    Completed,
    Rejected,
    Deleted
}

export type T_User = {
    id: number
    username: string
    email: string
    password: string,
    is_authenticated: boolean
    validation_error: boolean
    validation_success: boolean
    checked: boolean
    first_name: string
    last_name: string
}

export type T_LoginCredentials = {
    username: string
    password: string
}

export type T_RegisterCredentials = {
    username: string
    first_name: string
    last_name: string
    email: string
    password: string
}

export type T_ShipsListResponse = {
    ships: T_Ship[],
    draft_flight_id: number,
    ships_count: number
}