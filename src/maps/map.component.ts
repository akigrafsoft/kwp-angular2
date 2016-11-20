//
// Author: Kevin Moyse
//
import { Component, OnInit, Input } from '@angular/core';

declare var google: any;

@Component({
    selector: 'maps-map',
    template: '<div id="googleMap" style="width:500px;height:250px;"></div>'
    //styleUrls: ['css/app.css']
})
export class MapComponent implements OnInit {

    @Input() address: string;

    @Input() location: string;

    constructor() {
    }

    //'7+rue+condorcet+75009+paris'

    public refreshLocation(location: any) {
        var mapProp = {
            //center: new google.maps.LatLng(results[0].geometry.location.lat, results[0].geometry.location.lng),
            center: location,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        var marker = new google.maps.Marker({
            position: location
            //                    animation: google.maps.Animation.BOUNCE
        });
        marker.setMap(map);
    }

    ngOnInit() {

        if (typeof this.location !== 'undefined' && this.location !== null) {
            console.debug("MapComponent::ngOnInit() by location");
            this.refreshLocation(this.location);
            return;
        }
        // otherwise to by address
        if (typeof this.address !== 'undefined' && this.address !== null) {
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
                    this.refreshLocation(results[0].geometry.location);
                });
            return;
        }
    }
}