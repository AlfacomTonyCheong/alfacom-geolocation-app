import { Component, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Platform, AlertController, AlertOptions, ToastController, Toast, Events, ViewController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES } from '../../app/messages';
import { IMapPosition } from '../../interface/geolocation';

declare var google: any;

@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMapComponent {
  private unsubscribe$ = new Subject();

  mapOptions: google.maps.MapOptions = {
    backgroundColor: "#fff",
    center: { lat: 3.120455, lng: 101.612367 },
    zoom: 16,
    clickableIcons: true,
    draggable: true,
    fullscreenControl: false,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    streetViewControl: false,
    gestureHandling: "cooperative",
    scrollwheel: true,
    styles: [
      {
        elementType: 'geometry',
        featureType: 'water',
        stylers: [
          {
            color: '#00bdbd'
          }
        ]
      },
      {
        elementType: 'geometry',
        featureType: 'landscape.man_made',
        stylers: [
          {
            color: '#f7f1df'
          }
        ]
      }
    ],
    mapTypeControl: false,
    zoomControl: false
  };

  geolocationOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5 * 60 * 1000
  }

  map: google.maps.Map;
  isLoading: boolean;
  myPos: IMapPosition;
  myPosMarker: google.maps.Marker;
  infoWindow: google.maps.InfoWindow;
  geocoder: google.maps.Geocoder;

  showGeocoderResults: boolean;
  geocoderResults: google.maps.GeocoderResult[];

  errorStatus: boolean;
  errorMessage: string;

  watchId;
  toast: Toast;

  mapDragListener: any;
  showRecenterFab: boolean;

  @Input() callback;

  @ViewChild('searchbar', { read: ElementRef }) placeSearchBarRef: ElementRef;
  placeSearchBarInputElement: HTMLInputElement;
  isPlaceSearchActive: boolean;
  placeSearchInput: string;
  placeMarkers: google.maps.Marker[] = [];


  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef,
    private events: Events,
    private navParam: ViewController
  ) {
  }

  ngAfterViewInit() {
    this.placeSearchBarInputElement = this.placeSearchBarRef.nativeElement.querySelector('.searchbar-input');
    this.initMap();
  }

  ngOnDestroy() {
    this.disposeAll();
  }

  disposeAll() {
    this.toast && this.toast.dismiss();
    this.clearWatchPosition();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initMap() {
    this.isLoading = true;
    this.initGoogleMap().pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
      //this.watchPosition();
      this.getPosition().subscribe(() => {
        this.setMyPosMarker();
      }, (error) => {
        this.showToast(error);
      });
    });
    this.initMapClickEvent();
  }

  initGoogleMap(pos?: IMapPosition) {
    return new Observable((observer) => {
      if (pos)
        this.mapOptions.center = {
          lat: pos.latitude,
          lng: pos.longitude
        }

      // Create map
      this.map = new google.maps.Map(
        document.getElementById('map_canvas'),
        this.mapOptions
      );
      this.infoWindow = new google.maps.InfoWindow();
      this.geocoder = new google.maps.Geocoder();

      this.initCustomControls();

      this.isLoading = false;
      observer.next(true);
      observer.complete();
    });
  }

  getPosition() {
    return new Observable((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          if (!this.myPos)
            this.myPos = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy
            };
          else if (pos.coords.accuracy < this.myPos.accuracy) {
            this.myPos = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy
            };
          }

          observer.next();
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

  watchPosition() {
    console.log('Watch Position');

    this.watchId = navigator.geolocation.watchPosition((pos) => {
      console.dir(pos);
      if (!this.myPos)
        this.myPos = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
      else if (pos.coords.accuracy < this.myPos.accuracy) {
        this.myPos = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
      }

      if (!this.myPosMarker) {
        this.setMyPosMarker();
      }

    }, (err) => {
      console.error(err);
    }, this.geolocationOptions);
  }

  setMyPosMarker() {
    if(!this.myPosMarker)
      this.initMapDragEvent();

    if (this.myPosMarker) {
      this.myPosMarker.setMap(null);
    }

    this.myPosMarker = new google.maps.Marker({
      position: {
        lat: this.myPos.latitude,
        lng: this.myPos.longitude
      },
      map: this.map,
      animation: google.maps.Animation.DROP,
      title: 'You\'re Here!',
      draggable: true
    });
    this.myPosMarker.addListener('click', () => {
      this.infoWindow.setContent(this.myPosMarker.getTitle());
      this.infoWindow.open(this.map, this.myPosMarker);
    });
  }

  clearWatchPosition() {
    this.watchId && navigator.geolocation.clearWatch(this.watchId);
  }

  initCustomControls() {
    //this.initControl_CenterMap();
    //this.initControl_LocateMe();
    //this.initControl_PlaceMarker();
    this.initPlaceSearch();
  }

  showError(msg: string) {
    this.errorStatus = true;
    this.errorMessage = msg;
  }

  initMapDragEvent(){
    this.mapDragListener = google.maps.event.addListener(this.map,'dragstart',() => {
      this.showRecenterFab = true;
      this.cdr.detectChanges();
      //google.maps.event.removeListener(this.mapDragListener);
    });
  }

  initMapClickEvent(){
    google.maps.event.addListener(this.map, 'click', (ev) => {
      console.log('clicked: ' + ev.latLng.lat() + ' | ' + ev.latLng.lng());
      this.myPos = {
        latitude: ev.latLng.lat(),
        longitude: ev.latLng.lng(),
        accuracy: 1000
      }
      this.setMyPosMarker();
      this.showRecenterFab = false;
      this.cdr.detectChanges();
    });
  }

  confirmLocation(){
    if(this.myPos){
      this.panMapTo(this.myPos.latitude, this.myPos.longitude);
      console.log('Confirm Location: ' + JSON.stringify(this.myPos));
      this.events.publish('geolocationWatcher_start', this.myPos);

      let canvasSrc = 'https://maps.googleapis.com/maps/api/staticmap?center=' + this.myPos.latitude + ',' + this.myPos.longitude;
      canvasSrc += '&size=600x250&zoom=18&maptype=' + google.maps.MapTypeId.ROADMAP + '&key=AIzaSyCYi-w3mNVhQgqdUtY5BTlUac9RsxAc1y0';
      canvasSrc += '&markers=color:red|' +  this.myPos.latitude + ',' + this.myPos.longitude;
      this.events.publish('location_canvasImg', canvasSrc);
      this.callback();
    }
  }

  //===========================
  // Locate me
  //===========================
  initControl_LocateMe() {
    var controlDiv = document.createElement('div');
    var controlUI = document.createElement('div');
    var controlText = document.createElement('div');
    controlUI.classList.add('control-ui');
    controlUI.classList.add('icon-only');
    controlUI.title = 'Locate Me';
    controlText.classList.add('control-text');
    controlText.innerHTML = '<ion-icon name="locate" class="ion-icon ion-md-locate"></ion-icon>';

    controlDiv.appendChild(controlUI);
    controlUI.appendChild(controlText);
    let listener = controlUI.addEventListener('click', () => {
      this.locateMe();
    })

    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
  }

  locateMe(){
    this.getPosition().pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.setMyPosMarker();
      this.panMapTo(this.myPos.latitude, this.myPos.longitude);
    }, (errorMsg) => {
      this.alertMessage(ERROR_MESSAGES.geolocation_errorTitle, errorMsg);
    });
  }

  //===========================
  // Center Map
  //===========================
  initControl_CenterMap() {
    var controlDiv = document.createElement('div');
    var controlUI = document.createElement('div');
    var controlText = document.createElement('div');
    controlUI.classList.add('control-ui');
    controlUI.classList.add('icon-only');
    controlUI.title = 'Recenter map';
    controlText.classList.add('control-text');
    controlText.innerHTML = '<ion-icon name="body" class="ion-icon ion-md-body"></ion-icon>';

    controlDiv.appendChild(controlUI);
    controlUI.appendChild(controlText);
    let listener = controlUI.addEventListener('click', () => {
      this.centerMapOnMarker();
    })

    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
  }

  centerMapOnMarker(){
    if(this.myPosMarker){
      let pos = this.myPosMarker.getPosition();
      this.panMapTo(pos.lat(), pos.lng());
      this.showRecenterFab = false;
    }    
  }

  //===========================
  // Place Marker
  //===========================
  initControl_PlaceMarker() {
    var controlDiv = document.createElement('div');
    var controlUI = document.createElement('div');
    var controlText = document.createElement('div');
    controlUI.classList.add('control-ui');
    controlUI.classList.add('icon-only');
    controlUI.title = 'Place marker at current position';
    controlText.classList.add('control-text');
    controlText.innerHTML = '<ion-icon name="navigate" class="ion-icon ion-md-navigate"></ion-icon>';

    controlDiv.appendChild(controlUI);
    controlUI.appendChild(controlText);
    let listener = controlUI.addEventListener('click', () => {
      this.placeMarkerAtCurrentPosition();
    })

    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
  }

  placeMarkerAtCurrentPosition(){
    let pos = this.map.getCenter();
    if(this.myPos){
      this.myPos.latitude = pos.lat();
      this.myPos.longitude = pos.lng();
    }
    else{
      this.myPos = {
        latitude: pos.lat(),
        longitude: pos.lng(),
        accuracy: 1000
      }
    }
    this.setMyPosMarker();
    this.showRecenterFab = false;
  }

  //===========================
  // Place Search 
  //===========================
  initPlaceSearch() {
    //console.log('Searchbar Element: ' + JSON.stringify(this.placeSearchBarInputElement));
    var searchBox = new google.maps.places.SearchBox(this.placeSearchBarInputElement);

    // Bias the SearchBox results towards the current map viewport;
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      this.placeMarkers.forEach(function (marker) {
        marker.setMap(null);
      });
      this.placeMarkers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        this.createPlaceMarker(place);

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
  }

  createPlaceMarker(place: google.maps.places.PlaceResult) {
    var icon = {
      url: place.icon,
      //size: new google.maps.Size(71, 71),
      //origin: new google.maps.Point(0, 0),
      //anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    };

    // Create a marker for each place.
    var marker = new google.maps.Marker({
      map: this.map,
      icon: icon,
      title: place.name,
      position: place.geometry.location,
      animation: google.maps.Animation.DROP
    })
    this.placeMarkers.push(marker);

    google.maps.event.addListener(marker, 'click', () => {
      console.log('Marker Clicked: ' + place.name)
      this.infoWindow.setContent(place.name);
      this.infoWindow.open(this.map, marker);
    })

  }
  //===========================
  // Misc
  //===========================
  setMapCenter(lat: number, lng: number) {
    this.map.setCenter({ lat: lat, lng: lng });
  }

  panMapTo(lat: number, lng: number) {
    this.map.panTo({ lat: lat, lng: lng });
  }

  loadGeospatialData(map: google.maps.Map) {
    map.data.loadGeoJson('assets/geojson/states.geojson');
    map.data.setStyle({
      fillColor: 'blue',
      strokeColor: 'red',
      strokeWeight: 1
    });
  }

  alertMessage(title: string, message: string, options?: AlertOptions) {
    let alert = this.alertCtrl.create(options);
    alert.setTitle(title);
    alert.setSubTitle(message);
    alert.addButton({
      text: 'Okay',
      handler: () => {
      }
    });
    alert.present();
  }

  async showToast(msg: string){
    this.toast = this.toastCtrl.create({message: msg, position: 'bottom', duration: 3000});
    await this.toast.present();
  }
}
