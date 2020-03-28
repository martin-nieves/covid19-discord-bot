export interface Latest {
    confirmed: number;
    deaths: number;
    recovered: number;
}

export interface Coordinate {
    latitude: string;
    longitude: string;
}

export interface Latest {
    confirmed: number;
    deaths: number;
    recovered: number;
}

export interface Location {
    id: number;
    country: string;
    country_code: string;
    country_population: number;
    province: string;
    last_updated: string;
    coordinates: Coordinate;
    latest: Latest;
}

export interface CoronaResponse {
    latest: Latest;
    locations: Location[];
}