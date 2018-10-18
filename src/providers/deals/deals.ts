import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

export interface IVehicle{
  plateNumber: string,
  createdDate: string,
  modifiedDate: string
}

@Injectable()
export class DealsProvider {

  private storageString = 'vehicle';
  FourSquareApiRoot = "https://api.foursquare.com/v2/venues/";
  ClientId = "ZPMDH2YTYFAYDWIVDJ0U4HGMAY1DIKQNPGCAU53WB2VVCH5I";
  ClientSecret = "ZFQ22KBIWBYDTVEVYER3RMTDA2KHWY3ZKJSVAMXLBCBZKK5M";
  CurrDate:any;

  constructor(public http: HttpClient, public datepipe: DatePipe) {
    this.CurrDate = this.datepipe.transform(new Date(), 'yyyymmdd');
  }
  public GetDealsByCoordinates(coordinates:string){
    return this.http.get<any>(this.FourSquareApiRoot + "explore?client_id=" + this.ClientId +"&client_secret="+this.ClientSecret +"&v="+this.CurrDate+ "&limit=10&section=food&ll="+coordinates)
    
  }

  public GetVenueImage(venueId:string){
    return this.http.get<any>(this.FourSquareApiRoot+venueId+"/photos?client_id=" + this.ClientId +"&client_secret="+this.ClientSecret +"&v="+this.CurrDate)
  }

  
}
