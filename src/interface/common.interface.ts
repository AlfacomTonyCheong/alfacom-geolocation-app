export interface IGoogleMapComponentOptions {
    controls?: {
        recenter?: boolean,
        locationUpdate?: boolean,
        searchbar?: boolean,
        complaint?: boolean,
    },
    marker?: {
        currentPos?: boolean,
        draggable?: boolean,
        tapToPlace?: boolean
    }
}

export interface IIncidentData {
    category: string,
    description: string
}