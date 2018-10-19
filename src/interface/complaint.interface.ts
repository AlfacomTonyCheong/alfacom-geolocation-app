import { GeoPoint } from "@firebase/firestore-types";

export interface IComplaint{
    category: number,
    description?: string,
    position?: {
        geohash: string,
        geopoint: GeoPoint
    }
    created?: Date,
    createdBy?: string,
    modified?: Date,
    modifiedBy?: string
}

export interface IComplaintSocialData{
    commentCount?: number,
    likeCount?: number
}

export interface IComplaintComment{
    content: string,
    created?: Date,
    createdBy?: string,
    modified?: Date,
    modifiedBy?: string
}

export interface IComplaintLike{
    type: number,
    created?: Date,
    createdBy?: string
}