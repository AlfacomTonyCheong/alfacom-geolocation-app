export interface IGoogleMapComponentOptions {
    controls?: {
        recenter?: boolean,
        locationUpdate?: boolean,
        searchBar?: boolean,
        complaint?: boolean,
    },
    marker?: {
        enabled?: boolean,
        draggable?: boolean,
        tapToPlace?: boolean
    }
}