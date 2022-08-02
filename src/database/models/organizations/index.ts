import {Organization, OrganizationObj} from "./Organization";

const crypto = require("crypto");
const data = require('../MockData.json')
const fs = require('fs');

export class Organizations {

    readonly orgs = new Map<string, Organization>();
    idIncrement = 0;

    constructor(orgs: { [id: string]: OrganizationObj }) {
        this.orgs = this.convert(orgs);
        this.idIncrement = data.idIncrement;
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
        const id = (this.idIncrement+1).toString();
        const newOrg = new Organization({...org, id});
        this.idIncrement++;
        this.orgs.set(newOrg.id, newOrg);

        this.save();

        return newOrg;
    }

    delete(orgID: string) {
        const organization = this.orgs.get(orgID);
        this.orgs.delete(organization.id);
        organization.delete();
    }

    save() {
        fs.writeFileSync(__dirname + '/../MockData.json', JSON.stringify(this), 'utf-8');
    }

    toJSON() {
        return {
            idIncrement: this.idIncrement,
            participates: Object.fromEntries(this.orgs)
        };
    }

}
