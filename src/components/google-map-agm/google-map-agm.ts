import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { ComplaintsProvider } from '../../providers/complaints/complaints';
import { IGoogleMapComponentOptions } from '../../interface/common.interface';
import { Observable } from 'rxjs';
import { GeoQueryDocument } from 'geofirex';
import { GeoPoint, Timestamp } from '@firebase/firestore-types';
import { first } from 'rxjs/operators';
import { IComplaint, IComplaintComment, IComplaintLike } from '../../interface/complaint.interface';
import { ComplaintCategory, ComplaintLikeType } from '../../app/enums';
import * as moment from 'moment';
import { ModalController, ToastController, Toast } from 'ionic-angular';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { GalleryModal } from 'ionic-gallery-modal';

declare var google: any;

/**
 * Generated class for the GoogleMapAgmComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'google-map-agm',
  templateUrl: 'google-map-agm.html'
})
export class GoogleMapAgmComponent {
  @Input() canvasId: string;
  @Input() options: IGoogleMapComponentOptions;
  imgRoot:string = "assets/imgs/complaints/"
  map: google.maps.Map;
  mapCanvas: HTMLElement;
  complaintInfoWrapper: HTMLElement;
  geocoder: google.maps.Geocoder;
  overlay: google.maps.OverlayView;
  infoWindow: google.maps.InfoWindow;
  mapOptions: google.maps.MapOptions = {
    backgroundColor: "#fff",
    center: { lat: 3.120455, lng: 101.612367 },
    zoom: 16,
    clickableIcons: false,
    draggable: true,
    mapTypeControl: false,
    zoomControl: false,
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
      // {'featureType':'water','elementType':'all','stylers':[
      //   {'hue':'#7fc8ed'},{'saturation':55},{'lightness':-6},{'visibility':'on'}
      // ]},
      // {'featureType':'water','elementType':'labels','stylers':[
      //   {'hue':'#7fc8ed'},{'saturation':55},{'lightness':-6},{'visibility':'off'}
      // ]},
      // {'featureType':'poi.park','elementType':'geometry','stylers':[
      //   {'hue':'#83cead'},{'saturation':1},{'lightness':-15},{'visibility':'on'}
      // ]},
      // {'featureType':'landscape','elementType':'geometry','stylers':[
      //   {'hue':'#f3f4f4'},{'saturation':-84},{'lightness':59},{'visibility':'on'}
      // ]},
      // {'featureType':'landscape','elementType':'labels','stylers':[
      //   {'hue':'#ffffff'},{'saturation':-100},{'lightness':100},{'visibility':'off'}
      // ]},
      // {'featureType':'landscape.man_made','elementType':'geometry','stylers':[
      //   {'hue':'#f7f1df'},{'saturation':100},{'lightness':59},{'visibility':'on'}
      // ]},
      // {'featureType':'road','elementType':'geometry','stylers':[
      //   {'hue':'#ffffff'},{'saturation':-100},{'lightness':100},{'visibility':'on'}
      // ]},
      // {'featureType':'road','elementType':'labels','stylers':[
      //   {'hue':'#bbbbbb'},{'saturation':-100},{'lightness':26},{'visibility':'on'}
      // ]},
      // {'featureType':'road.arterial','elementType':'geometry','stylers':[
      //   {'hue':'#ffcc00'},{'saturation':100},{'lightness':-35},{'visibility':'simplified'}
      // ]},
      // {'featureType':'road.highway','elementType':'geometry','stylers':[
      //   {'hue':'#ffcc00'},{'saturation':100},{'lightness':-22},{'visibility':'on'}
      // ]},
      // {'featureType':'poi.school','elementType':'all','stylers':[
      //   {'hue':'#d7e4e4'},{'saturation':-60},{'lightness':23},{'visibility':'on'}
      // ]}
    ]
  };

  points: Observable<GeoQueryDocument[]>;

  constructor(private geolocationProvider: GeolocationProvider, private complaintsProvider: ComplaintsProvider, private modalCtrl: ModalController, private toastCtrl: ToastController) {

  }

  ngOnDestroy() {
    this.toast && this.toast.dismiss();
  }

  onMapReady(map) {
    console.log('Map Ready');
    this.map = map;
    this.map.setOptions(this.mapOptions);
    this.mapCanvas = document.getElementById('google-map_' + this.canvasId);

    this.complaintInfoWrapper = document.getElementById('complaint-info_' + this.canvasId);

    this.geocoder = new google.maps.Geocoder();
    this.infoWindow = new google.maps.InfoWindow();
    this.overlay = new google.maps.OverlayView();
    this.overlay.draw = function () { };
    this.overlay.setMap(this.map);

    this.geolocationProvider.getPosition().subscribe((pos) => {
      console.log('[Geolocation] Lat: ' + pos.coords.latitude + ' | Lng: ' + pos.coords.longitude + ' | Acc: ' + pos.coords.accuracy);
      this.map.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      this.map.panTo(this.map.getCenter());
      this.initCustomControls();
      //this.getComplaintPoints();
      this.initMapEvents();
      //this.seedFirestore();
    }, (err) => {
      console.error(err);
    })
  }

  initCustomControls() {
    this.initControl_PlaceSearch();
    this.initControl_ComplaintPin();
  }

  mapCenterChangedTimer;
  mapCenterChangedTimeoutValue = 1000;
  initMapEvents() {
    this.map.addListener('idle', () => {
      console.log('Map Idle');
      this.mapCenterChangedTimer && clearTimeout(this.mapCenterChangedTimer);
      this.mapCenterChangedTimer = setTimeout(() => {
        this.getComplaintPoints();
      }, this.mapCenterChangedTimeoutValue)
    });
    this.map.addListener('bounds_changed', () => {
      this.mapCenterChangedTimer && clearTimeout(this.mapCenterChangedTimer);
    });
  }

  //===========================
  // Complaints
  //===========================
  markers: google.maps.Marker[] = [];
  markerLimit: number = 50;
  currentComplaint: IComplaint;
  currentComplaintId: string;
  currentComplaintSocialData: any;
  currentComplaintComments: AngularFirestoreCollection<IComplaintComment>;
  currentComplaintLikes: AngularFirestoreCollection<IComplaintLike>;
  likeBtnDisabled: boolean;
  getComplaintPoints() {
    this.points = this.complaintsProvider.GeoFireX_GetInRadiusObs(this.map.getCenter().lat(), this.map.getCenter().lng(), 5);
    this.points.pipe(first()).subscribe((data) => {
      for (var d of data) {
        if (this.markers.findIndex(x => x.getTitle() === d.id) == -1) {
          var geoPoint = d.position.geopoint as GeoPoint;
          d = this.getCategoryTitle(d)
          const marker = new google.maps.Marker({
            position: {
              lat: geoPoint.latitude,
              lng: geoPoint.longitude
            },
            animation: google.maps.Animation.DROP,
            title: d.id,
            complaintId: d.id,
            complaintData: d
          });
          google.maps.event.addListener(marker, 'click', () => {
            this.showComplaint(marker);
          });
          marker.setMap(this.map);
          this.markers.push(marker);
        }
        if (this.markers.length > this.markerLimit) {
          this.dropSuperfluousMarkers()
        }
      }
    });
  }

  dropSuperfluousMarkers() {
    var mapBounds = this.map.getBounds();
    for (var i = this.markers.length - 1; i >= 0; i--) {
      if (!this.markers[i]) continue;
      if (!mapBounds.contains(this.markers[i].getPosition())) {
        // console.log('Dropping marker: ' + this.markers[i].getTitle());
        this.markers[i].setMap(null);
        this.markers.splice(i, 1);
      }
    }
  }

  showComplaint(marker: google.maps.Marker) {
    this.map.panTo(marker.getPosition());
    this.currentComplaint = marker['complaintData'];
    console.dir(this.currentComplaint);
    this.currentComplaintId = marker['complaintId'];
    this.getComplaintSocialData();
    this.showComplaintInfoWrapper();
    google.maps.event.addListenerOnce(this.map, 'center_changed', this.hideComplaintInfoWrapper);
  }

  getComplaintSocialData() {
    this.currentComplaintSocialData = this.complaintsProvider.GetSocialData(this.currentComplaintId).valueChanges();
    //this.currentComplaintLikes = this.complaintsProvider.GetLikes(this.currentComplaintId);
  }

  async showCommentsModal() {
    this.currentComplaintComments = this.complaintsProvider.GetComments(this.currentComplaintId);

    var modalPage = this.modalCtrl.create(
      'ComplaintCommentsPage',
      {
        commentId: this.currentComplaintId,
        comments: this.currentComplaintComments
      },
      {
        showBackdrop: true,
        enableBackdropDismiss: true
      }
    );

    await modalPage.present();
  }

  showComplaintInfoWrapper = () => {
    this.complaintInfoWrapper.classList.add('show');
  }

  hideComplaintInfoWrapper = () => {
    console.log('hide');
    this.complaintInfoWrapper.classList.remove('show');
  }

  onLikeBtnClick() {
    this.likeBtnDisabled = true;
    this.complaintsProvider.GetIfLikeExistsByUser(this.currentComplaintId, 'System').pipe(first()).subscribe((exists) => {
      console.log('like exists: ' + exists);
      if (exists[0] == true) {
        console.log('delete like');
        this.complaintsProvider.DeleteLike(this.currentComplaintId, 'System');
      }
      else {
        console.log('add like');
        var like: IComplaintLike = {
          type: ComplaintLikeType.Like,
          createdBy: 'System'
        }
        this.complaintsProvider.AddNewLike(this.currentComplaintId, like);
      }
    })
    setTimeout(() => { this.likeBtnDisabled = false }, 3000);
  }

  //===========================
  // Place Search Control
  //===========================
  @ViewChild('searchbar', { read: ElementRef }) placeSearchBarRef: ElementRef;
  placeSearchBarInputElement: HTMLInputElement;
  placeMarkers: google.maps.Marker[] = [];
  placeSearchInput: string;

  initControl_PlaceSearch() {
    //console.log('Searchbar Element: ' + JSON.stringify(this.placeSearchBarInputElement));
    this.placeSearchBarInputElement = this.placeSearchBarRef.nativeElement.querySelector('.searchbar-input');
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
  // Drag & Drop Pin
  //===========================
  pinEle;
  pinEleIsDragging: boolean;
  pinEleMouseStartDrag = [0, 0];
  pinEleCenter = [20, 20]; // Change this when size of pin is changed
  pinEleActivePoint = [20, 40]; // Change this when size of pin is changed
  pinEle_oriTop; pinEle_oriLeft;
  initControl_ComplaintPin() {
    this.pinEle = document.getElementById('complain-pin');

    this.pinEle_oriTop = this.pinEle.style.top;
    this.pinEle_oriLeft = this.pinEle.style.left;

    this.pinEle.addEventListener('mousedown', this.PinDragStart);
    this.pinEle.addEventListener('touchstart', this.PinDragStart);

  }

  PinDragStart = (ev) => {
    if (this.pinEle) {
      console.log('DragStart');
      var rect = this.pinEle.getBoundingClientRect();
      var x, y;
      if (ev instanceof TouchEvent) {
        x = ev.touches[0].pageX - rect.left;
        y = ev.touches[0].pageY - rect.top;
        this.pinEleMouseStartDrag = [x, y];
        this.pinEle.addEventListener('touchmove', this.PinDragMove);
        this.pinEle.addEventListener('touchend', this.PinDragEnd);
        this.pinEle.addEventListener('touchcancel', this.PinDragCancel);
      }
      else if (ev instanceof MouseEvent) {
        x = ev.clientX - rect.left;
        y = ev.clientY - rect.top;
        this.pinEleMouseStartDrag = [x, y];
        this.mapCanvas.addEventListener('mousemove', this.PinDragMove);
        this.mapCanvas.addEventListener('mouseup', this.PinDragEnd);
        this.pinEle.addEventListener('mouseup', this.PinDragEnd);
      }
    }
  }

  PinDragMove = (ev) => {
    if (this.pinEle) {
      console.log('DragMove');
      var xPos, yPos;
      if (ev instanceof TouchEvent) {
        xPos = ev.touches[0].pageX - this.mapCanvas.getBoundingClientRect().left - this.pinEleCenter[0];
        yPos = ev.touches[0].pageY - this.mapCanvas.getBoundingClientRect().top - this.pinEleCenter[1];
      }
      else if (ev instanceof MouseEvent) {
        xPos = ev.clientX - this.mapCanvas.getBoundingClientRect().left - this.pinEleCenter[0];
        yPos = ev.clientY - this.mapCanvas.getBoundingClientRect().top - this.pinEleCenter[1];
      }
      this.pinEle.style.top = (yPos) + 'px';
      this.pinEle.style.left = (xPos) + 'px';
    }
  }

  PinDragEnd = (ev) => {
    if (this.pinEle) {
      console.log('DragEnd');
      this.pinEle.style.top = this.pinEle_oriTop;
      this.pinEle.style.left = this.pinEle_oriLeft;

      console.dir(ev);

      var coordinatesOverDiv;
      if (ev instanceof TouchEvent) {
        coordinatesOverDiv = [ev.changedTouches[0].pageX - this.mapCanvas.getBoundingClientRect().left, ev.changedTouches[0].pageY - this.mapCanvas.getBoundingClientRect().top];
        this.pinEle.removeEventListener('touchmove', this.PinDragMove);
        this.pinEle.removeEventListener('touchend', this.PinDragEnd);
        this.pinEle.removeEventListener('touchcancel', this.PinDragCancel);
      }
      else {
        coordinatesOverDiv = [ev.clientX - this.mapCanvas.getBoundingClientRect().left, ev.clientY - this.mapCanvas.getBoundingClientRect().top];
        this.mapCanvas.removeEventListener('mousemove', this.PinDragMove);
        this.mapCanvas.removeEventListener('mouseup', this.PinDragEnd);
        this.pinEle.removeEventListener('mouseup', this.PinDragEnd);
      }

      // Get position of the active point
      coordinatesOverDiv = [
        coordinatesOverDiv[0] + this.pinEleActivePoint[0] - this.pinEleMouseStartDrag[0],
        coordinatesOverDiv[1] + this.pinEleActivePoint[1] - this.pinEleMouseStartDrag[1]
      ];

      // ask Google Map to get the position, corresponding to a pixel on the map
      var pixelLatLng = this.overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(coordinatesOverDiv[0], coordinatesOverDiv[1]));

      this.openComplaintModal(pixelLatLng);
    }
  }

  PinDragCancel = (ev) => {
    console.log('DragCancel');
    this.pinEle.style.top = this.pinEle_oriTop;
    this.pinEle.style.left = this.pinEle_oriLeft;

    if (ev instanceof TouchEvent) {
      this.pinEle.removeEventListener('touchmove', this.PinDragMove);
      this.pinEle.removeEventListener('touchend', this.PinDragEnd);
      this.pinEle.removeEventListener('touchcancel', this.PinDragCancel);
    }
    else {
      this.mapCanvas.removeEventListener('mousemove', this.PinDragMove);
      this.mapCanvas.removeEventListener('mouseup', this.PinDragEnd);
      this.pinEle.removeEventListener('mouseup', this.PinDragEnd);
    }
  }

  openComplaintModal(latLng: google.maps.LatLng) {
    this.reverseGeocode(latLng.lat(), latLng.lng()).then((result) => {
      var modalPage = this.modalCtrl.create(
        'ComplaintModalPage',
        {
          location: result,
          locationLatLng: latLng
        },
        {
          showBackdrop: true,
          enableBackdropDismiss: true
        }
      );
      modalPage.present();

      modalPage.onDidDismiss(data => {
        if (data && data.submitted) {
          var newComplaint: IComplaint = {
            category: data.category,
            description: data.description,
            images: data.images,
            createdBy: 'System'
          };
          this.complaintsProvider.AddNewComplaint(newComplaint, latLng.lat(), latLng.lng());
          this.showToast("Complaint successfully submitted!")
          this.map.panTo({ lat: latLng.lat(), lng: latLng.lng() })
        }
      });
    });
  }

  //===========================
  // Misc Functions
  //===========================
  reverseGeocode(lat: number, lng: number) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ 'location': { lat: lat, lng: lng } }, (results, status) => {
        if (status.toString() === 'OK') {
          if (results[0]) {
            resolve(results[0].formatted_address)
          } else {
            resolve("Latitude: " + lat + "; Longtitude: " + lng)
          }
        } else {
          resolve("Latitude: " + lat + "; Longtitude: " + lng)
        }
      })
    })
  }

  toast: Toast;
  async showToast(msg: string) {
    this.toast = this.toastCtrl.create({ message: msg, position: 'bottom', duration: 3000 });
    await this.toast.present();
  }

  getCategoryTitle(complaint: any) {
    this.complaintsProvider.GetComplaintCategoryById(complaint.category.toString()).then((data)=>{complaint.categoryName = data})
    return complaint;
  }

  getImgSrc(name:string){
    if (name){
      return this.imgRoot + name.toLowerCase() + '.png'
    }
  }

  viewImages(){
    var photos = this.currentComplaint.images.map(item => ({url:item}));
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: photos,
      initialSlide: 0
    });
    modal.present();
  }

  getMomentFromNow(date: Timestamp) {
    return moment(date.toDate()).fromNow();
  }

  //===========================
  // Dev Functions
  //===========================
  onDevButtonClick() {
    this.seedComplaintComment();
    this.seedComplaintLike();
  }

  seedFirestore() {
    this.seedFirestoreComplaintPoints();
  }

  seedFirestoreComplaintPoints() {
    var lat = 3.120455;
    var lng = 101.612367;
    var n = 5;

    var complaint: IComplaint = {
      category: this.getRandomComplaintCategory(),
      description: 'This is some placeholder description. An apple a day keeps the doctors away.',
      createdBy: 'System'
    }

    for (var i = 0; i < n; i++) {
      lat += 0.0025;
      complaint.category = this.getRandomComplaintCategory();
      this.complaintsProvider.AddNewComplaint(complaint, lat, lng);
      lat -= 0.0025; lng += 0.0025;
      complaint.category = this.getRandomComplaintCategory();
      this.complaintsProvider.AddNewComplaint(complaint, lat, lng);
      lat += 0.0025;
      complaint.category = this.getRandomComplaintCategory();
      this.complaintsProvider.AddNewComplaint(complaint, lat, lng);
    }
  }

  seedComplaintComment() {
    var comment: IComplaintComment = {
      content: 'This is yet another seeded comment.',
      createdBy: 'System'
    }
    this.complaintsProvider.AddNewComment('vrBGi6MCXq2kLVlAYX2Y', comment);
  }

  seedComplaintLike() {
    var like: IComplaintLike = {
      type: 1,
      createdBy: 'System'
    }
    this.complaintsProvider.AddNewLike('vrBGi6MCXq2kLVlAYX2Y', like);
  }

  getRandomComplaintCategory() {
    var rdm = Math.ceil((Math.random() * 6));
    var val;
    switch (rdm) {
      case 1:
        val = ComplaintCategory.Traffic; break;
      case 2:
        val = ComplaintCategory.Trees; break;
      case 3:
        val = ComplaintCategory.Walkways; break;
      case 4:
        val = ComplaintCategory.Potholes; break;
      case 5:
        val = ComplaintCategory.Highways; break;
      case 6:
        val = ComplaintCategory.CarBreakdown; break;
    }
    return val;
  }

}
