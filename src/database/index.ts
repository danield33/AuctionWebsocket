import {Organizations} from "./models/organizations";

const data = require('../../OrgData.json');

class Auction {

    readonly organizations: Organizations

    constructor() {
        this.organizations = new Organizations(data.participates)
    }

}

export const db = new Auction();
