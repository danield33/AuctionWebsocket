import {Organization, OrganizationObj} from "./Organization";
const crypto = require("crypto");
const data = require('../MockData.json')
const fs = require('fs');

export class Organizations{

  readonly orgs = new Map<string, Organization>();

  constructor(orgs: OrganizationObj) {
    this.orgs = this.convert(orgs as unknown as {[id: string]: typeof Organization.prototype});

  }

  convert(orgObj: {[id: string]: typeof Organization.prototype}): Map<string, Organization> {
    const entries: Array<any> = Object.entries(orgObj)
      .map(i => [i[0], new Organization(i[1])]);
    return new Map(entries);
  }

  add(org: OrganizationObj){
    const id = crypto.randomBytes(16).toString('hex')
    const newOrg = new Organization({...org, id});
    this.orgs.set(newOrg.id, newOrg);

    return newOrg;
  }

  save(){
    fs.writeFileSync(__dirname+'/../MockData.json', JSON.stringify(data, null, 2), 'utf-8');
  }

  toJSON(){
    return Object.fromEntries(this.orgs);
  }

}
