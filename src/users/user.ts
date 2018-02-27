//
// Author: Kevin Moyse
//

import {Address} from './address';

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

  public static build(document: any): User {
    let o_object = new User();

    for (const k in document) {
      if (document.hasOwnProperty(k)) {
        switch (k) {
          case '_id':
            o_object.id = document._id.$oid;
            break;
          case 'id':
            if (typeof document._id === 'undefined') {
              o_object.id = document.id;
            }
            break;
          case 'address':
            if (document.address !== null) {
              o_object.address = Address.build(document.address);
            }
            else {
              o_object.address = null;
            }
            break;
          case 'roles':
            if (document.roles !== null) {
              for (const name of document.roles) {
                o_object.roles.push(name);
              }
            }
            break;
          default:
            o_object[k] = document[k];
        }
      }
    }

    //        if (typeof document._id !== 'undefined')
    //            o_object.id = document._id.$oid;
    //        o_object.username = document.username;
    //        o_object.firstName = document.firstName;
    //        o_object.lastName = document.lastName;
    //        o_object.email = document.email;
    //        if (typeof document.phone !== 'undefined')
    //            o_object.phone = document.phone;

    //    if ((typeof document.address !== 'undefined') && (document.address !== null))
    //      o_object.address = Address.build(document.address);
    //    else
    //      o_object.address = null;
    //
    //    if (typeof document.roles !== 'undefined' && document.roles != null) {
    //      for (var name of document.roles) {
    //        o_object.roles.push(name);
    //      }
    //    }

    //    if (typeof document.activationTimeMillis !== 'undefined')
    //      o_object.activationTimeMillis = document.activationTimeMillis;
    //    if (typeof document.lSLTMs !== 'undefined')
    //      o_object.lSLTMs = document.lSLTMs;

    return o_object;
  }

  public hasRole(role: string): boolean {
    for (var name of this.roles) {
      if (role === name)
        return true;
    }
    return false;
  }

}