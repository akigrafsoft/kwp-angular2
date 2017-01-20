//
// Author: Kevin Moyse
//
import { Component, OnInit, Input } from '@angular/core';
//import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

declare var google: any;

@Component({
    selector: 'kwp-maps-map',
    template: '<div id="map"></div>',
    styles: ['#map { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }']
})
export class MapComponent implements OnInit {

    @Input() address: string;

    @Input() location: any;

    private map: any = null;
    //private marker: any = null;


    private markers: Array<any> = new Array<any>();

    //constructor(private sanitizer: DomSanitizer) {
    constructor() {
        //     this.mySafeStyle = this.sanitizer.bypassSecurityTrustStyle("width:" + this.width + "px;height:" + this.height + "px");
        //     console.log("MapComponent::constructor|style=" + this.mySafeStyle);
    }

    //'7+rue+condorcet+75009+paris'

    private clearMarkers() {
        for (let marker of this.markers) {
            marker.setMap(null);
        }
        this.markers = new Array<any>();
    }

    public refreshLocation(location: any) {
        this.clearMarkers();

        if (this.map === null)
            this.createMap(location);
        else
            this.map.setCenter(location);

        let marker = new google.maps.Marker({
            position: location
            //                    animation: google.maps.Animation.BOUNCE
        });
        marker.setMap(this.map);
        this.markers.push(marker);
    }

    private createMap(location: any) {
        var mapProp = {
            //center: new google.maps.LatLng(results[0].geometry.location.lat, results[0].geometry.location.lng),
            center: location,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(document.getElementById("map"), mapProp);

        // In order to re-center map to location when window is resized
        let _self = this;
        google.maps.event.addDomListener(window, 'resize', function() {
            console.log("map:resize");
            _self.map.setCenter(_self.location);
        });
    }

    //    public fit(markers: Array<google.maps.Marker>) {
    //        var bounds = new google.maps.LatLngBounds();
    //        for (var i = 0; i < markers.length; i++) {
    //            bounds.extend(markers[i].getPosition());
    //        }
    //        this.map.fitBounds(bounds);
    //    }

    public setMarkers(locations: Array<any>) {
        console.debug("MapComponent::setMarkers(" + JSON.stringify(locations) + ")");

        this.clearMarkers();

        if (locations.length === 0)
            return;

        if (locations.length === 1) {
            this.refreshLocation(locations[0]);
            return;
        }

        if (this.map === null) {
            var mapProp = {
                zoom: 10,
                center: locations[0],
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.map = new google.maps.Map(document.getElementById("map"), mapProp);
        }

        var bounds = new google.maps.LatLngBounds();
        for (let location of locations) {
            var marker = new google.maps.Marker({
                position: location
            });
            marker.setMap(this.map);
            this.markers.push(marker);
            bounds.extend(location);
        }

        if (locations.length > 1)
            this.map.fitBounds(bounds);
    }

    ngOnInit() {

        if (typeof google === 'undefined') {
            console.error("MapComponent|Google API not loaded");
            return;
        }

        var l_location: any;

        if (typeof this.location !== 'undefined' && this.location !== null) {
            //console.debug("MapComponent::ngOnInit() by location");
            this.createMap(this.location);
            this.refreshLocation(this.location);
        }
        // otherwise to by address
        else if (typeof this.address !== 'undefined' && this.address !== null) {
            //console.debug("MapComponent::ngOnInit() by address");
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
                    this.createMap(results[0].geometry.location);
                    this.refreshLocation(results[0].geometry.location);
                });
        }

    }
}