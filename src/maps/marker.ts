//
// Author: Kevin Moyse
//

//import { LatLng } from './lat-lng';

export class Marker {

    public id: string;
    public location: any;

    constructor(id: string, location: any) {
        this.id = id;
        this.location = location;
    }

    public static build(id: string, lat: number, lng: number): Marker {
        return new Marker(id, { lat: lat, lng: lng });
    }

}