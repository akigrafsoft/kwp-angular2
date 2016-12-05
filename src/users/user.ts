//
// Author: Kevin Moyse
//

export class User {
    //public id: string;
    public username: string;
    public firstName: string;
    public lastName: string;
    public address: any;
    public roles: string[];
    public activationTime: string;
    public email: string;

    //lastSuccessfulLoginTime
    public lSLTMs: string;

    public hasRole(i_role: string): boolean {
        for (var name of this.roles) {
            if (i_role === name)
                return true;
        }
        return false;
    }

}