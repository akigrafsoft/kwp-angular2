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
    public address: Address = null;
    public roles: Array<string>;
    public activationTimeMillis: string;

    password: string;
    password2: string;

    //lastSuccessfulLoginTime
    public lSLTMs: string;

    constructor() {
        this.roles = new Array<string>();
    }

    public static build(user: any): User {
        let o_user = new User();

        if (typeof user._id !== 'undefined')
            o_user.id = user._id.$oid;

        o_user.username = user.username;
        o_user.firstName = user.firstName;
        o_user.lastName = user.lastName;
        o_user.email = user.email;
        if (typeof user.phone !== 'undefined')
            o_user.phone = user.phone;

        if ((typeof user.address !== 'undefined') && (user.address !== null))
            o_user.address = Address.build(user.address);
        else
            o_user.address = null;

        if (typeof user.roles !== 'undefined' && user.roles != null)
            o_user.roles = new Array<string>(user.roles);

        if (typeof user.activationTimeMillis !== 'undefined')
            o_user.activationTimeMillis = user.activationTimeMillis;
        if (typeof user.lSLTMs !== 'undefined')
            o_user.lSLTMs = user.lSLTMs;

        return o_user;
    }

    public hasRole(role: string): boolean {
        for (var name of this.roles) {
            if (role === name)
                return true;
        }
        return false;
    }

}