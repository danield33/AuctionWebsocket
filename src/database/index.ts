import { Organizations } from "./models/organizations";

const data = require('./models/MockData.json');

class Auction{

    readonly organizations: Organizations

    constructor() {
        this.organizations = new Organizations(data.participates)
    }

}

export const db = new Auction();
