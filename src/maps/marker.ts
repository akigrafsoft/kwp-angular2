//
// Author: Kevin Moyse
//

export class Marker {

  public id: string;
  public location: any;
  public static build(id: string, lat: number, lng: number): Marker {
    return new Marker(id, {lat: lat, lng: lng});
  }
  constructor(id: string, location: any) {
    this.id = id;
    this.location = location;
  }
}
