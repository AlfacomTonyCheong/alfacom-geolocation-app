import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Events, ToastController } from 'ionic-angular';
import { Subject } from 'rxjs';
import { IMapPosition } from '../../interface/geolocation.interface';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { first } from 'rxjs/operators';

/**
 * Generated class for the GeolocationWatcherComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'geolocation-watcher',
  templateUrl: 'geolocation-watcher.html'
})
export class GeolocationWatcherComponent {
  @ViewChild('geolocationWatcher') wrapperRef: ElementRef;

  private unsubscribe$ = new Subject();
  accuracyThreshold: number = 10000;
  watchTimeout: number = 5000;

  watchId;
  watchTimer;

  options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };
  myPos: IMapPosition;
  myPosAddress: string;

  text: string;
  success: boolean;
  locating: boolean;
  loading: boolean;

  constructor(private events: Events, private cdr: ChangeDetectorRef, private toastCtrl: ToastController, private geolocationProvider: GeolocationProvider) {

  }

  ngAfterViewInit() {
    this.events.subscribe('geolocationWatcher_start', this.start);
    this.events.subscribe('geolocationWatcher_stop', this.stop);
    //this.showToast();
  }

  ngOnDestroy() {
    this._unsubscribe();
  }

  _unsubscribe() {
    this.watchTimer && clearTimeout(this.watchTimer);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }



  start = (pos?: google.maps.LatLng) => {
    console.log('[GeolocationWatcher] Start');

    if (pos) {
      this.getMyPosAddress(pos);
    }
    else{
      this.geolocationProvider.getPosition().pipe(first()).subscribe((pos) => {
        this.getMyPosAddress(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      })
    }
    // else if (!this.watchId) {

    //   this.success = false;
    //   this.locating = true;
    //   this.loading = true;
    //   this.text = 'Locating...';

    //   this.watchTimer = setTimeout(() => {
    //     this.stop('Timed out');
    //     this.cdr.detectChanges();
    //   }, this.watchTimeout);

    //   this.watchId = navigator.geolocation.watchPosition((pos) => {
    //     console.dir(pos);
    //     this.myPos = {
    //       latitude: pos.coords.latitude,
    //       longitude: pos.coords.longitude,
    //       accuracy: pos.coords.accuracy
    //     };
    //     if (this.myPos.accuracy <= this.accuracyThreshold) {
    //       this.stop();
    //       this.getMyPosAddress();
    //     }
    //   }, (err) => {
    //     console.error(err);
    //   }, this.options);
    // }
  }

  getMyPosAddress(latLng: google.maps.LatLng) {
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({ 'location': latLng }, (results, status) => {
      console.log('Geocode status: ' + status);
      if (status.toString() === 'OK') {
        console.dir(results);
        this.update(results[0].formatted_address, latLng);
      }
    })
  }

  stop = (msg?: string) => {
    console.log('[GeolocationWatcher] Stop');
    if (this.watchId) {
      this.loading = false;
      if (msg) this.text = msg;
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = undefined;
      this.watchTimer && clearTimeout(this.watchTimer);
    }

    setTimeout(() => {
      this.resetVariables();
    }, 2000);
  }

  update(address: string, pos: google.maps.LatLng) {
    console.log(this.myPosAddress);
    this.text = 'Located';
    this.success = true;
    this.cdr.detectChanges();
    this.events.publish('geolocationWatcher_update', { address: address,lat: pos.lat(), lng: pos.lng()});
  }

  resetVariables() {
    this.success = false;
    this.locating = false;
  }

  async showToast() {
    let toast = this.toastCtrl.create({ message: 'Locating...', position: 'bottom', cssClass: 'loading-toast' });
    await toast.present();
  }
}
