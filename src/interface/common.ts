export interface IGoogleMapComponentOptions {
    controls?: {
        recenter?: boolean,
        locationUpdate?: boolean,
        searchbar?: boolean,
        complaint?: boolean,
    },
    marker?: {
        enabled?: boolean,
        draggable?: boolean,
        tapToPlace?: boolean
    }
}