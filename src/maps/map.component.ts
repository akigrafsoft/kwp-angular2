//
// Author: Kevin Moyse
//
import { Component, OnInit, Input } from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

declare var google: any;

@Component({
    selector: 'kwp-maps-map',
    template: '<div id="googleMap" style="width:354px;height:200px"></div>'
    //styleUrls: ['css/app.css']
})
export class MapComponent implements OnInit {

    @Input() address: string;

    @Input() location: any;

    //  @Input() width: number = 354;
    //  @Input() height: number = 200;

    private map: any = null;
    private marker: any = null;

    private mySafeStyle: SafeStyle;

    constructor(private sanitizer: DomSanitizer) {
        //     this.mySafeStyle = this.sanitizer.bypassSecurityTrustStyle("width:" + this.width + "px;height:" + this.height + "px");
        //     console.log("MapComponent::constructor|style=" + this.mySafeStyle);
    }

    //'7+rue+condorcet+75009+paris'

    public refreshLocation(location: any) {

        if (this.marker !== null)
            this.marker.setMap(null);

        if (this.map === null)
            this.createMap(location);
        else
            this.map.setCenter(location);

        this.marker = new google.maps.Marker({
            position: location
            //                    animation: google.maps.Animation.BOUNCE
        });
        this.marker.setMap(this.map);
    }

    private createMap(location: any) {
        var mapProp = {
            //center: new google.maps.LatLng(results[0].geometry.location.lat, results[0].geometry.location.lng),
            center: location,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    }

    //    public addMarker(location: any) {
    //        var marker = new google.maps.Marker({
    //            position: location
    //        });
    //        marker.setMap(this.map);
    //    }

    ngOnInit() {

        var l_location: any;

        if (typeof this.location !== 'undefined' && this.location !== null) {
            console.debug("MapComponent::ngOnInit() by location");
            this.createMap(this.location);
            this.refreshLocation(this.location);
        }
        // otherwise to by address
        else if (typeof this.address !== 'undefined' && this.address !== null) {
            console.debug("MapComponent::ngOnInit() by address");
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