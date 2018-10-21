//
// Author: Kevin Moyse
//
import {Component, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
// import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import {Marker} from './marker';

declare var google: any;

@Component({
  selector: 'kwp-maps-map',
  template: '<div id="map"></div>',
  styles: [`
#map { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
`]
  //    #map * { overflow:visible;}
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() address: string = null;

  private init = false;

  private _l: any = null;
  @Input() set location(l: any) {

    if (typeof l === 'undefined') {
      return;
    }

    this._l = l;

    if (this._l !== null && this.init === true) {
      this.refreshLocation(this._l);
    }
  }

  @Input() zoom = 11;

  @Output() onClickMarker = new EventEmitter<string>();
  @Output() onMouseOverMarker = new EventEmitter<string>();
  @Output() onMouseOutMarker = new EventEmitter<string>();

  map: any = null;

  private _bounds: any = null;
  markersHashMap: Object = new Object();

  // constructor(private sanitizer: DomSanitizer) {
  constructor() {
    //     this.mySafeStyle = this.sanitizer.bypassSecurityTrustStyle("width:" + this.width + "px;height:" + this.height + "px");
    //     console.log("MapComponent::constructor|style=" + this.mySafeStyle);
  }

  //'7+rue+condorcet+75009+paris'

  private clearMarkers() {
    for (var k in this.markersHashMap) {
      this.markersHashMap[k].setMap(null);
      google.maps.event.clearListeners(this.markersHashMap[k], 'click');
      google.maps.event.clearListeners(this.markersHashMap[k], 'mouseover');
      google.maps.event.clearListeners(this.markersHashMap[k], 'mouseout');
    }
    this.markersHashMap = new Object();
  }

  private refreshLocation(location: any) {
    if (typeof google === 'undefined') {
      console.error('Map::refreshLocation()|Google API not loaded');
      return;
    }

    // console.debug("Map::refreshLocation()|" + JSON.stringify(location));

    this.clearMarkers();

    if (this.map === null) {
      this.createMap(location);
    }

    let g_marker = new google.maps.Marker({
      position: location
    });
    this.markersHashMap['location'] = g_marker;
    g_marker.setMap(this.map);

    this.map.setCenter(location);
  }

  public bounceMarker(markerId: string) {
    const marker = this.markersHashMap[markerId];
    if (typeof marker !== 'undefined' && marker !== null) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  public unBounceMarker(markerId: string) {
    const marker = this.markersHashMap[markerId];
    if (typeof marker !== 'undefined' && marker !== null) {
      marker.setAnimation(null);
    }
  }

  private createMap(location: any) {
    // console.debug("Map::createMap()|" + JSON.stringify(location));
    const mapProp = {
      center: location,
      zoom: this.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapProp);
  }

  public setMarkers(markers: Array<Marker>) {
    // console.debug("Map::setMarkers(" + JSON.stringify(markers) + ")");

    if (typeof google === 'undefined') {
      console.error('Map::setMarkers()|Google API not loaded');
      return;
    }

    this.clearMarkers();

    if (markers.length === 0) {
      return;
    }

    if (markers.length === 1) {
      this.refreshLocation(markers[0].location);
      return;
    }

    if (this.map === null) {
      const mapProp = {
        zoom: 10,
        center: markers[0].location,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(document.getElementById('map'), mapProp);
    }

    let _self = this;
    let bounds = new google.maps.LatLngBounds();
    for (let marker of markers) {
      const g_marker = new google.maps.Marker({
        position: marker.location
      });
      g_marker.setMap(this.map);
      // this.markers.push(marker);
      this.markersHashMap[marker.id] = g_marker;

      google.maps.event.addListener(g_marker, 'click', function() {
        // console.debug("Map::click|" + marker.id);
        _self.onClickMarker.emit(marker.id);
      });
      google.maps.event.addListener(g_marker, 'mouseover', function() {
        // console.debug("Map::mouseover|" + marker.id);
        _self.onMouseOverMarker.emit(marker.id);
      });
      google.maps.event.addListener(g_marker, 'mouseout', function() {
        // console.debug("Map::mouseout|" + marker.id);
        _self.onMouseOutMarker.emit(marker.id);
      });

      bounds.extend(g_marker.getPosition());
    }

    this._bounds = bounds;
    this.map.fitBounds(bounds);
  }

  ngAfterViewInit() {}

  ngOnInit() {

    if (typeof google === 'undefined') {
      console.error('Map::ngOnInit()|Google API not loaded');
      return;
    }

    if (typeof this._l !== 'undefined' && this._l !== null) {
      // console.debug("Map::ngOnInit() by location " + JSON.stringify(this._l));
      this.refreshLocation(this._l);
    } else if (typeof this.address !== 'undefined' && this.address !== null) {
      // console.debug("Map::ngOnInit() by address");
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          address: this.address.replace(' ', '+'),
          region: 'no'
        }, function(results, status) {
          if (status !== 'OK') {
            console.error('Map::geocode() returned status=' + status);
            return;
          }
          // console.log("geocoder status=" + status);
          // console.log("geocoder results=" + JSON.stringify(results[0]));
          // this.createMap(results[0].geometry.location);
          this.refreshLocation(results[0].geometry.location);
        });
    }

    // In order to re-center map to location when window is resized
    let _self = this;
    google.maps.event.addDomListener(window, 'resize', function() {
      if (_self._bounds) {
        // console.debug("Map::resize|bounds");
        _self.map.fitBounds(_self._bounds);
      } else {
        // console.debug("Map::resize|center");
        _self.map.setCenter(_self._l);
      }
    });

    this.init = true;
  }

  ngOnDestroy() {
    // prevent memory leak
    this.clearMarkers();
  }
}
