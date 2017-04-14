//
// Author: Kevin Moyse
//

import { LatLng } from './lat-lng';

export class Marker {

    public id: string;
    public location: LatLng;

    constructor(id: string, location: LatLng) {
        this.id = id;
        this.location = location;
    }

    public static build(id: string, lat: number, lng: number): Marker {
        return new Marker(id, new LatLng(lat, lng));
    }

}