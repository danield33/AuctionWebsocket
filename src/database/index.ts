import {Organizations} from "./models/organizations";
import './firebase'
const data = require('../../OrgData.json');

class Auction {

    readonly organizations: Organizations;

    constructor() {
        this.organizations = new Organizations()
    }

}

export const db = new Auction();
