export class Address {
    addressLine1: string;
    addressLine2: string;
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
}