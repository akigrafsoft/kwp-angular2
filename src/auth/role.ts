//
// Author: Kevin Moyse
//

export class Role {
    public name: string;
    public frontendRights: Array<string>;

    constructor() {
        this.frontendRights = new Array<string>();
    }

    public static build( json: any ): Role {
        let o_role: Role = new Role();
        o_role.name = json.name;
        if ( typeof json.frontendRights !== 'undefined' ) {
            for ( const right of json.frontendRights ) {
                o_role.frontendRights.push( right );
            }
        }
        return o_role;
    }
}
