//
// Author: Kevin Moyse
//

import { Address } from './address';

export class User {
    public id: string;
    public username: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public address: Address;
    public roles: string[];
    public activationTimeMillis: string;

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