import { Component, ViewChild, ElementRef } from '@angular/core';
// import { GoogleMapOptions, GoogleMaps, Marker, GoogleMapsEvent } from '@ionic-native/google-maps';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Platform, AlertController, AlertOptions } from 'ionic-angular';
// import { LocationAccuracy } from '@ionic-native/location-accuracy';
// import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Subject } from 'rxjs/Subject';

declare var google: any;

export interface IMapPosition {
  lat: number,
  lng: number
}

@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMapComponent {
  private unsubscribe$ = new Subject();

  map: any;
  isLoading: boolean;
  myPos: IMapPosition;
  myPosMarker: google.maps.Marker;
  infoWindow: google.maps.InfoWindow;
  geocoder: google.maps.Geocoder;

  showGeocoderResults: boolean;
  geocoderResults: google.maps.GeocoderResult[];

  errorStatus: boolean;
  errorMessage: string;

  isPolygonCreatorActive: boolean;
  pcControlPosition: google.maps.ControlPosition = google.maps.ControlPosition.BOTTOM_LEFT;
  pcControls: any[] = [];
  pcBounds: google.maps.Marker[] = [];
  pcPolygons: google.maps.Polygon[] = [];
  pcPrevPolygon: google.maps.Polygon;

  isFNLActive: boolean;
  fnlNumberOfResults: number = 25;
  fnlNumberofDrivingResults: number = 25;
  fnlAddress: string;
  fnlMarkers: google.maps.Marker[] = [];
  isPointNearPolygon: boolean;

  @ViewChild('searchbar', {read: ElementRef}) placeSearchBarRef: ElementRef;
  placeSearchBarInputElement: HTMLInputElement;
  isPlaceSearchActive: boolean;
  placeSearchInput: string;
  placeMarkers: google.maps.Marker[] = [];

  constructor(
    private geolocation: Geolocation,
    private platform: Platform,
    // private locationAccuracy: LocationAccuracy,
    // private androidPermissions: AndroidPermissions,
    private alertCtrl: AlertController
  ) {
  }

  ngAfterViewInit() {
    this.checkGPS();
    this.placeSearchBarInputElement = this.placeSearchBarRef.nativeElement.querySelector('.searchbar-input');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /***********************/
  /***** Common Code *****/
  /***********************/
  checkGPS() {
    this.isLoading = true;

    this.platform.ready().then(() => {
      console.log('Running on platform: ' + this.platform.platforms());
      if (this.platform.is('cordova') === true) {
        // this.locationAccuracy.canRequest().then((canRequest) => {
        //   if (canRequest) {
        //     this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
        //       this.loadGoogleMap_Native();
        //     }).catch((error) => {
        //       console.error('Error requesting location: [' + error.code + '] ' + error.message);
        //     })
        //   }
        //   else {
        //     // Can't request location accuracy, request for Location permission
        //     if (this.platform.is('android') === true) {
        //       let permissions = [this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION];
        //       this.androidPermissions.requestPermissions(permissions).then((resp) => {
        //         if (resp.hasPermission === true) {

        //         }
        //       });
        //     }
        //   }
        // });
      }
      else {
        this.loadGoogleMap();
      }
    })
  }

  showError(msg: string) {
    this.errorStatus = true;
    this.errorMessage = msg;
  }

  /************************/
  /***** Browser Code *****/
  /************************/
  loadGoogleMap() {
    let options: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000
    }
    this.geolocation.getCurrentPosition(options).then((position: Position) => {
      this.myPos = { lat: position.coords.latitude, lng: position.coords.longitude };
      this.initGoogleMap(position.coords.latitude, position.coords.longitude);
    }).catch((error) => {
      console.error('Error getting location: [' + error.code + '] ' + error.message);
      this.alertCurrentPositionError();
    })

    this.geolocation.watchPosition(options).takeUntil(this.unsubscribe$).subscribe((position: Position) => {
      this.myPos = { lat: position.coords.latitude, lng: position.coords.longitude };
      this.myPosMarker.setPosition(this.myPos);
      console.log('My Position changed: ' + JSON.stringify(this.myPos));
    });

  }

  initGoogleMap(lat: number, lng: number) {
    let mapOptions: google.maps.MapOptions = {
      backgroundColor: "#fff",
      center: { lat: lat, lng: lng },
      clickableIcons: true,
      draggable: true,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
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
      zoom: 16
    };
    // Create map
    this.map = new google.maps.Map(
      document.getElementById('map_canvas'),
      mapOptions
    );

    // Init InfoWindow
    this.infoWindow = new google.maps.InfoWindow();

    // Init Geocoder
    this.geocoder = new google.maps.Geocoder();

    this.isLoading = false;

    this.initCustomControls(this.map);
    this.initPlaceSearch();
    //this.loadGeospatialData(this.map);

    this.myPosMarker = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      },
      map: this.map,
      animation: google.maps.Animation.DROP,
      title: 'You\'re Here!'
    });
    this.myPosMarker.addListener('click', () => {
      this.infoWindow.setContent(this.myPosMarker.getTitle());
      this.infoWindow.open(this.map, this.myPosMarker);
    });
  }

  initCustomControls(map: google.maps.Map) {
    this.initControl_CenterMap(map);
    this.initControl_PolygonCreator(map);
    //this.initControl_FNL(map);
  }

  initControl_CenterMap(map: google.maps.Map) {
    var controlDiv = document.createElement('div');
    var controlUI = document.createElement('div');
    var controlText = document.createElement('div');
    controlUI.classList.add('control-ui');
    controlUI.classList.add('icon-only');
    controlUI.title = 'Recenter map';
    controlText.classList.add('control-text');
    controlText.innerHTML = '<ion-icon name="locate" class="ion-icon ion-md-locate"></ion-icon>';

    controlDiv.appendChild(controlUI);
    controlUI.appendChild(controlText);
    let listener = controlUI.addEventListener('click', () => {
      this.panMapTo(this.myPos.lat, this.myPos.lng);
    })

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
  }

  //===========================
  // Polygon Creator
  //===========================
  initControl_PolygonCreator(map: google.maps.Map) {
    var controlDiv = document.createElement('div');
    var controlUI = document.createElement('div');
    var controlText = document.createElement('div');
    controlUI.classList.add('control-ui');
    controlUI.classList.add('icon-only');
    controlUI.title = 'Launch Polygon Creator';
    controlText.classList.add('control-text');
    controlText.innerHTML = '<ion-icon name="cube" class="ion-icon ion-md-cube"></ion-icon>';

    controlDiv.appendChild(controlUI);
    controlUI.appendChild(controlText);
    let listener = controlUI.addEventListener('click', () => {
      this.startPolygonCreator(map);
    })
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
  }

  startPolygonCreator(map: google.maps.Map) {
    if (!this.isPolygonCreatorActive) {
      console.log('[Polygon Creator] Started');
      this.isPolygonCreatorActive = true;

      // Next Bound Control
      var nbControlDiv = document.createElement('div');
      var nbControlUI = document.createElement('div');
      var nbControlText = document.createElement('div');
      nbControlUI.classList.add('control-ui');
      nbControlUI.classList.add('icon-only');
      nbControlUI.title = 'Next Bound';
      nbControlText.classList.add('control-text');
      nbControlText.innerHTML = '<ion-icon name="arrow-forward" class="ion-icon ion-md-arrow-forward"></ion-icon>';

      nbControlDiv.appendChild(nbControlUI);
      nbControlUI.appendChild(nbControlText);
      let nbListener = nbControlUI.addEventListener('click', () => {
        this.polygonCreator_AddBound(map);
      })
      map.controls[this.pcControlPosition].push(nbControlDiv);
      this.pcControls.push(nbControlDiv);

      // Duplicate Last Polygon Control
      var dlpControlDiv = document.createElement('div');
      var dlpControlUI = document.createElement('div');
      var dlpControlText = document.createElement('div');
      dlpControlUI.classList.add('control-ui');
      dlpControlUI.classList.add('icon-only');
      dlpControlUI.title = 'Duplicate Last Polygon';
      dlpControlText.classList.add('control-text');
      dlpControlText.innerHTML = '<ion-icon name="copy" class="ion-icon ion-md-copy"></ion-icon>';

      dlpControlDiv.appendChild(dlpControlUI);
      dlpControlUI.appendChild(dlpControlText);
      let dlpListener = dlpControlUI.addEventListener('click', () => {
        this.polygonCreator_CreatePrevPolygon(map);
      })
      map.controls[this.pcControlPosition].push(dlpControlDiv);
      this.pcControls.push(dlpControlDiv);

      // Finish Polygon Creation Control
      var fpcControlDiv = document.createElement('div');
      var fpcControlUI = document.createElement('div');
      var fpcControlText = document.createElement('div');
      fpcControlUI.classList.add('control-ui');
      fpcControlUI.classList.add('icon-only');
      fpcControlUI.title = 'Finish Polygon Creation';
      fpcControlText.classList.add('control-text');
      fpcControlText.innerHTML = '<ion-icon name="checkmark-circle-outline" class="ion-icon ion-md-checkmark-circle-outline"></ion-icon>';

      fpcControlDiv.appendChild(fpcControlUI);
      fpcControlUI.appendChild(fpcControlText);
      let fpcListener = fpcControlUI.addEventListener('click', () => {
        this.polygonCreator_CreateNewPolygon(map);
      })
      map.controls[this.pcControlPosition].push(fpcControlDiv);
      this.pcControls.push(fpcControlDiv);

      // Clear All Polygons Control
      var capControlDiv = document.createElement('div');
      var capControlUI = document.createElement('div');
      var capControlText = document.createElement('div');
      capControlUI.classList.add('control-ui');
      capControlUI.classList.add('icon-only');
      capControlUI.title = 'Clear All';
      capControlText.classList.add('control-text');
      capControlText.innerHTML = '<ion-icon name="trash" class="ion-icon ion-md-trash"></ion-icon>';

      capControlDiv.appendChild(capControlUI);
      capControlUI.appendChild(capControlText);
      let capListener = capControlUI.addEventListener('click', () => {
        this.polygonCreator_ClearAllPolygons();
        this.polygonCreator_ClearAllBounds();
      })
      map.controls[this.pcControlPosition].push(capControlDiv);
      this.pcControls.push(capControlDiv);
    }
    else {
      console.log('[Polygon Creator] Stopped');
      this.isPolygonCreatorActive = false;
      this.polygonCreator_ClearControls();
    }
  }

  polygonCreator_ClearControls() {
    let map = this.map as google.maps.Map;
    map.controls[this.pcControlPosition].clear();
  }

  polygonCreator_AddBound(map: google.maps.Map) {
    var mapListener = map.addListener('click', (ev) => {
      console.log('Map Click: ' + JSON.stringify(ev));
      var marker = new google.maps.Marker({
        position: ev.latLng,
        draggable: true,
        map: map,
        label: this.pcBounds.length.toString(),
        animation: google.maps.Animation.DROP,
        title: 'Polygon Bound ' + this.pcBounds.length.toString()
      });
      this.pcBounds.push(marker);
      google.maps.event.removeListener(mapListener);
    })
  }

  polygonCreator_CreateNewPolygon(map: google.maps.Map) {
    if (this.pcBounds.length > 1) {
      let paths = [];
      for (let pcBound of this.pcBounds) {
        paths.push(pcBound.getPosition());
      }
      let newPolygon = new google.maps.Polygon({
        paths: paths,
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ff0000',
        fillOpacity: 0.35,
        draggable: true,
        geodesic: true,
        editable: true
      })
      newPolygon.setMap(map);
      this.pcPolygons.push(newPolygon);
      this.pcPrevPolygon = newPolygon;
      this.polygonCreator_ClearAllBounds();
    }
    else {
      this.alertMessage('Error', 'The polygon could not be created because there are not enough bounds on the map.');
    }
  }

  polygonCreator_CreatePrevPolygon(map: google.maps.Map) {
    if (this.pcPrevPolygon) {
      let center: google.maps.LatLng = this.getPolygonBounds(this.pcPrevPolygon).getCenter();
      center = new google.maps.LatLng(center.lat(), center.lng() + 0.0002);

      let newPolygon = new google.maps.Polygon({
        paths: this.pcPrevPolygon.getPaths(),
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ff0000',
        fillOpacity: 0.35,
        draggable: true,
        geodesic: true,
        editable: true
      });
      newPolygon.setMap(map);
      this.movePolygonTo(newPolygon, center);
      this.pcPolygons.push(newPolygon);
      this.pcPrevPolygon = newPolygon;
    }
    else {
      this.alertMessage('Error', 'A polygon must be created first before you can duplicate it.');
    }
  }

  polygonCreator_ClearAllPolygons() {
    for (let polygon of this.pcPolygons) {
      polygon.setMap(null);
    }
    this.pcPolygons = [];
  }

  polygonCreator_ClearAllBounds() {
    for (let pcBound of this.pcBounds) {
      pcBound.setMap(null);
    }
    this.pcBounds = [];
  }

  getPolygonBounds = (polygon: google.maps.Polygon) => {
    var bounds = new google.maps.LatLngBounds();
    var paths = polygon.getPaths();
    var path;

    for (var p = 0; p < paths.getLength(); p++) {
      path = paths.getAt(p);
      for (var i = 0; i < path.getLength(); i++) {
        bounds.extend(path.getAt(i));
      }
    }

    return bounds;
  }

  movePolygonTo(polygon: google.maps.Polygon, latLng: google.maps.LatLng) {
    // our vars
    var boundsCenter = this.getPolygonBounds(polygon).getCenter(), // center of the polygonbounds
      paths = polygon.getPaths(), // paths that make up the polygon
      newPaths = []; // array containing the new paths that make up the polygon

    var latlngToPoint = function (map, latlng) {
      var normalizedPoint = map.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
      var scale = Math.pow(2, map.getZoom());
      var pixelCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);
      return pixelCoordinate;
    };
    var pointToLatlng = function (map, point) {
      var scale = Math.pow(2, map.getZoom());
      var normalizedPoint = new google.maps.Point(point.x / scale, point.y / scale);
      var latlng = map.getProjection().fromPointToLatLng(normalizedPoint);
      return latlng;
    };

    // calc the pixel position of the bounds and the new latLng
    var boundsCenterPx = latlngToPoint(this.map, boundsCenter),
      latLngPx = latlngToPoint(this.map, latLng);

    // calc the pixel difference between the bounds and the new latLng
    var dLatPx = (boundsCenterPx.y - latLngPx.y) * (-1),
      dLngPx = (boundsCenterPx.x - latLngPx.x) * (-1);

    // adjust all paths
    for (var p = 0; p < paths.getLength(); p++) {
      let path = paths.getAt(p);
      newPaths.push([]);
      for (var i = 0; i < path.getLength(); i++) {
        var pixels = latlngToPoint(this.map, path.getAt(i));
        pixels.x += dLngPx;
        pixels.y += dLatPx;
        newPaths[newPaths.length - 1].push(pointToLatlng(this.map, pixels));
      }
    }

    // Update the path of the Polygon to the new path
    polygon.setPaths(newPaths);

    // Return the polygon itself so we can chain
    return this;
  }


  //===========================
  // Find Nearest Locations (FNL)
  //===========================
  initControl_FNL(map: google.maps.Map) {
    var controlDiv = document.createElement('div');
    var controlUI = document.createElement('div');
    var controlText = document.createElement('div');
    controlUI.classList.add('control-ui');
    controlUI.classList.add('icon-only');
    controlUI.title = 'Find Nearest Locations';
    controlText.classList.add('control-text');
    controlText.innerHTML = '<ion-icon name="map" class="ion-icon ion-md-map"></ion-icon>';

    controlDiv.appendChild(controlUI);
    controlUI.appendChild(controlText);
    let listener = controlUI.addEventListener('click', () => {
      this.startFNL(map);
    })

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
  }

  startFNL(map: google.maps.Map) {
    if (!this.isFNLActive) {
      console.log('[Find Nearest Location] Started');
      this.isFNLActive = true;

    }
    else {
      console.log('[Find Nearest Location] Stopped');
      this.isFNLActive = false;
    }
  }

  checkPointNearPolygon(){
    // point: google.maps.LatLng, polygon: google.maps.Polygon
    // Optionally pass tolerance as 3rd parameter. Default tolerance is 10^-9
    // Tolerance is based on the decimal place accuracy desired in terms of LatLng
    // Each LatLng degree is approx. 111km. 
    if(this.myPosMarker == null || this.pcPrevPolygon == null) return undefined;
    let point = this.myPosMarker.getPosition();
    let polygon = this.pcPrevPolygon;
    this.isPointNearPolygon = google.maps.geometry.poly.isLocationOnEdge(point, polygon, 0.001); // within approx 111 meters
  }

  geocodeAddress() {
    if (this.fnlAddress.length > 2) {
      this.geocoder.geocode({
        address: this.fnlAddress,

      }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          this.showGeocoderResults = true;
          this.geocoderResults = results;

          this.map.setCenter(results[0].geometry.location);
          if (this.myPosMarker)
            this.myPosMarker.setPosition(results[0].geometry.location);
        }
        else{
          this.alertMessage('Error', 'Geocode failed: ' + status);
        }
      })
    }
  }

  //===========================
  // Place Search 
  //===========================
  initPlaceSearch() {
    console.log('Searchbar Element: ' + JSON.stringify(this.placeSearchBarInputElement));
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

  createPlaceMarker(place: google.maps.places.PlaceResult){
    var icon = {
      url: place.icon,
      //size: new google.maps.Size(71, 71),
      //origin: new google.maps.Point(0, 0),
      //anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(40, 40)
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

  panMapTo(lat: number, lng: number){
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

  alertCurrentPositionError() {
    let alert = this.alertCtrl.create({ enableBackdropDismiss: false });
    alert.setTitle('Alfacom Geolocation requires access to location');
    alert.setSubTitle('Please turn on your GPS and press "Retry".');
    alert.addButton({
      text: 'Cancel',
      handler: () => {
        this.isLoading = false;
        this.showError('Map could not be loaded because location access was denied.');
      }
    });
    alert.addButton({
      text: 'Retry',
      handler: () => {
        this.loadGoogleMap();
      }
    });
    alert.present();
  }

  /***********************/
  /***** Native Code *****/
  /***********************/
  // loadGoogleMap_Native() {
  //   // Get location using ionic native GoogleMaps LocationService
  //   // @ionic-natve/google-maps@4.* does not work on browsers
  //   let options: GeolocationOptions = {
  //     enableHighAccuracy: true,
  //     timeout: 10000
  //   }
  //   this.geolocation.getCurrentPosition(options).then((position: Position) => {
  //     this.myPos = { lat: position.coords.latitude, lng: position.coords.longitude };
  //     this.initGoogleMap_Native(position.coords.latitude, position.coords.longitude);
  //   }).catch((error) => {
  //     let errorMsg = 'Error getting location: [' + error.code + '] ' + error.message;
  //     console.error(errorMsg);
  //     this.showError(errorMsg);
  //   })
  // }

  // initGoogleMap_Native(lat: number, lng: number) {
  //   let mapOptions: GoogleMapOptions = {
  //     camera: {
  //       target: {
  //         lat: lat,
  //         lng: lng
  //       },
  //       zoom: 16
  //     }
  //   };
  //   this.map = GoogleMaps.create('map_canvas', mapOptions);
  //   this.map.on(GoogleMapsEvent.MAP_READY).takeUntil(this.unsubscribe$).subscribe(() => {
  //     this.isLoading = false;
  //   });
  //   this.map.addMarker({
  //     title: 'You\'re Here!',
  //     icon: 'blue',
  //     animation: 'DROP',
  //     position: {
  //       lat: lat,
  //       lng: lng
  //     }
  //   }).then(this.onMarkerAdded_Native);
  // }

  // onMarkerAdded_Native(marker: Marker) {
  //   marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
  //     alert('Marker \'' + marker.getTitle() + '\' clicked.');
  //   })
  // }

}
