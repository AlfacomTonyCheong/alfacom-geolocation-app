import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES } from '../../app/messages';

/*
  Generated class for the GeolocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeolocationProvider {
  
  private geolocationOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5 * 60 * 1000
  }
  private watchId;

  constructor() {
  }

  getPosition() : Observable<Position>{
    return new Observable((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          observer.next(pos);
          observer.complete();
        }, (err) => {
          let errMsg;
          switch (err.code) {
            case 0: // Unknown Error
              errMsg = ERROR_MESSAGES.geolocation_unknownError;
              break;
            case 1: // Permission Denied
              errMsg = ERROR_MESSAGES.geolocation_permissionDenied;
              break;
            case 2: // Position Unavailable (error response from location provider)
              errMsg = ERROR_MESSAGES.geolocation_positionUnavailable;
              break;
            case 3: // Timed Out
              errMsg = ERROR_MESSAGES.geolocation_timedOut;
              break;
          }
          observer.error(errMsg);
        }, this.geolocationOptions)
      }
      else {
        observer.error(ERROR_MESSAGES.geolocation_unsupported);
      }
    })
  }


  // WIP
  watchPosition() : Observable<Position> {
    return new Observable((observer) => {
      this.watchId = navigator.geolocation.watchPosition((pos) => {
        observer.next(pos);
      }, (err) => {
        console.error(err);
      }, this.geolocationOptions);
    });  
  }
  
  clearWatchPosition() {
    this.watchId && navigator.geolocation.clearWatch(this.watchId);
  }
}
