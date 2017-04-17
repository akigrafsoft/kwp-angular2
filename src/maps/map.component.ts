//
// Author: Kevin Moyse
//
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
//import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

//import { LatLng } from './lat-lng';
import { Marker } from './marker';

declare var google: any;

@Component({
    selector: 'kwp-maps-map',
    template: '<div id="map"></div>',
    styles: ['#map { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }']
})
export class MapComponent implements OnInit, OnDestroy {

    @Input() address: string = null;

    private init: boolean = false;

    private _l: any = null;
    @Input() set location(l: any) {

        if (typeof l === 'undefined') {
            return;
        }

        this._l = l;

        //        if (l instanceof LatLng)
        //            this._l = l;
        //        else if (l !== null)
        //            this._l = new LatLng(l.lat, l.lng);
        //        else
        //            this._l = null;

        if (this._l !== null && this.init === true)
            this.refreshLocation(this._l);
    }

    @Output() onClickMarker = new EventEmitter<string>();
    @Output() onMouseOverMarker = new EventEmitter<string>();
    @Output() onMouseOutMarker = new EventEmitter<string>();

    map: any = null;

    //markers: Array<Marker> = new Array<any>();
    markersHashMap: Object = new Object();

    //constructor(private sanitizer: DomSanitizer) {
    constructor() {
        //     this.mySafeStyle = this.sanitizer.bypassSecurityTrustStyle("width:" + this.width + "px;height:" + this.height + "px");
        //     console.log("MapComponent::constructor|style=" + this.mySafeStyle);
    }

    //'7+rue+condorcet+75009+paris'

    private clearMarkers() {
        //        for (let marker of this.markers) {
        //            marker.setMap(null);
        //        }
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
            console.error("Map::refreshLocation()|Google API not loaded");
            return;
        }

        console.debug("Map::refreshLocation()|" + JSON.stringify(location));

        this.clearMarkers();

        if (this.map === null)
            this.createMap(location);
        else
            this.map.setCenter(new google.maps.LatLng(location.lat, location.lng));

        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.lat, location.lng)
            //                    animation: google.maps.Animation.BOUNCE
        });

        marker.setMap(this.map);

        //this.markers.push(marker);
        this.markersHashMap["location"] = marker;
    }

    public bounceMarker(markerId: string) {
        var marker = this.markersHashMap[markerId];
        if (typeof marker !== 'undefined' && marker !== null) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    public unBounceMarker(markerId: string) {
        var marker = this.markersHashMap[markerId];
        if (typeof marker !== 'undefined' && marker !== null) {
            marker.setAnimation(null);
        }
    }

    private createMap(location: any) {
        let l_center = new google.maps.LatLng(location.lat, location.lng);
        var mapProp = {
            center: l_center,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(document.getElementById("map"), mapProp);
    }

    //    public fit(markers: Array<google.maps.Marker>) {
    //        var bounds = new google.maps.LatLngBounds();
    //        for (var i = 0; i < markers.length; i++) {
    //            bounds.extend(markers[i].getPosition());
    //        }
    //        this.map.fitBounds(bounds);
    //    }

    public setMarkers(markers: Array<Marker>) {
        //console.debug("Map::setMarkers(" + JSON.stringify(markers) + ")");

        if (typeof google === 'undefined') {
            console.error("Map::setMarkers()|Google API not loaded");
            return;
        }

        this.clearMarkers();

        if (markers.length === 0)
            return;

        if (markers.length === 1) {
            this.refreshLocation(markers[0].location);
            return;
        }

        if (this.map === null) {
            var mapProp = {
                zoom: 10,
                center: markers[0].location,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.map = new google.maps.Map(document.getElementById("map"), mapProp);
        }

        let _self = this;
        var bounds = new google.maps.LatLngBounds();
        for (let marker of markers) {
            var g_marker = new google.maps.Marker({
                position: marker.location
            });
            g_marker.setMap(this.map);
            //this.markers.push(marker);
            this.markersHashMap[marker.id] = g_marker;

            google.maps.event.addListener(g_marker, 'click', function() {
                //console.debug("Map::click|" + marker.id);
                _self.onClickMarker.emit(marker.id);
            });
            google.maps.event.addListener(g_marker, 'mouseover', function() {
                //console.debug("Map::mouseover|" + marker.id);
                _self.onMouseOverMarker.emit(marker.id);
            });
            google.maps.event.addListener(g_marker, 'mouseout', function() {
                //console.debug("Map::mouseout|" + marker.id);
                _self.onMouseOutMarker.emit(marker.id);
            });

            bounds.extend(g_marker.getPosition());
        }

        //if (markers.length > 1)
        this.map.fitBounds(bounds);
    }

    ngOnInit() {

        if (typeof google === 'undefined') {
            console.error("Map::ngOnInit()|Google API not loaded");
            return;
        }

        if (typeof this._l !== 'undefined' && this._l !== null) {
            console.debug("Map::ngOnInit() by location");
            //this.createMap(this._l);
            this.refreshLocation(this._l);

            // In order to re-center map to location when window is resized
            let _self = this;
            google.maps.event.addDomListener(window, 'resize', function() {
                //console.debug("map:resize");
                var l_center = new google.maps.LatLng(_self._l.lat, _self._l.lng);
                _self.map.setCenter(l_center);
            });
        }
        // otherwise to by address
        else if (typeof this.address !== 'undefined' && this.address !== null) {
            //console.debug("Map::ngOnInit() by address");
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode(
                {
                    address: this.address.replace(' ', '+'),
                    region: 'no'
                }, function(results, status) {
                    if (status !== "OK") {
                        console.error("Map::geocode() returned status=" + status);
                        return;
                    }
                    // console.log("geocoder status=" + status);
                    // console.log("geocoder results=" + JSON.stringify(results[0]));
                    //this.createMap(results[0].geometry.location);
                    this.refreshLocation(results[0].geometry.location);
                });
        }

        this.init = true;
    }

    ngOnDestroy() {
        // prevent memory leak
        this.clearMarkers();
    }
}