import { GeoPoint } from "@firebase/firestore-types";
import { AngularFirestoreCollection } from "@angular/fire/firestore";

export interface IComplaint{
    category: number,
    categoryName?:string,
    description?: string,
    position?: {
        geohash: string,
        geopoint: GeoPoint
    },
    images?: string[],
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

export interface IComplaintCategory{
    Id:string,
    Name:string
    Color:string
}

export interface IMP{
    id:string,
    name: number,
    area?:string,
    imgName?: string
}

export interface IMPComplaint{
    id:string,
    category: number,
    categoryName?:string,
    description?: string,
    subject?: string,
    created?: Date,
    createdBy?: string,
    modified?: Date,
    modifiedBy?: string,
    mpId?:string,
    socialData?:any
}