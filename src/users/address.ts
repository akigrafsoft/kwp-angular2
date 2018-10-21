export class Address {
  line1: string;
  line2: string;
  postalCode: string;
  town: string;
  province: string;
  state: string;

  public static build(document: any): Address {
    let o_object = new Address();
    for (var k in document) {
      switch (k) {
        default:
          o_object[k] = document[k];
      }
    }
    return o_object;
  }

  public static of(a: Address): Address {
    let o_object = new Address();
    o_object.line1 = a.line1;
    o_object.line2 = a.line2;
    o_object.postalCode = a.postalCode;
    o_object.town = a.town;
    o_object.province = a.province;
    o_object.state = a.state;
    return o_object;
  }
}
