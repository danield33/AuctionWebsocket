const fs = require('fs');
const data = require('../MockData.json');

export interface OrganizationObj{
    name: string;
    id: string;
    image: string;
    description: string;
}

export class Organization{

    name: string;
    id: string;
    image: string;
    description: string;

    constructor(organization: OrganizationObj) {
        this.name = organization.name;
        this.id = organization.id;
        this.image = organization.image;
        this.description = organization.description;
    }

    save(){
        data.participates[this.id] = this;
        fs.writeFileSync(__dirname+'/../MockData.json', JSON.stringify(data, null, 2), 'utf-8');
    }

}
