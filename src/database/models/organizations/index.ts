import {Organization, OrganizationObj} from "./Organization";

const crypto = require("crypto");
const data = require('../MockData.json')
const fs = require('fs');

export class Organizations {

    readonly orgs = new Map<string, Organization>();

    constructor(orgs: { [id: string]: OrganizationObj }) {
        this.orgs = this.convert(orgs);

    }

    convert(orgObj: { [id: string]: OrganizationObj }): Map<string, Organization> {
        const entries: Array<any> = Object.entries(orgObj)
            .map(i => {
                const organization = new Organization(i[1]);
                return [i[0], organization]
            });
        return new Map(entries);
    }

    add(org: OrganizationObj) {
        const id = crypto.randomBytes(16).toString('hex')
        const newOrg = new Organization({...org, id});
        this.orgs.set(newOrg.id, newOrg);

        return newOrg;
    }

    delete(orgID: string) {
        const organization = this.orgs.get(orgID);
        this.orgs.delete(organization.id);
        organization.delete();
    }

    save() {
        fs.writeFileSync(__dirname + '/../MockData.json', JSON.stringify(data, null, 2), 'utf-8');
    }

    toJSON() {
        return Object.fromEntries(this.orgs);
    }

}
