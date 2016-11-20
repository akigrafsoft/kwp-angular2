//
// Author: Kevin Moyse
//

export class Role {
    public name: string;

    public frontendRights: Array<string>;
    public backendRights : Array<string>;

    public notAllowedActions: Array<string>;
}