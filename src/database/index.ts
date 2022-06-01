import { Organizations } from "./models/organizations";

const data = require('./MockData.json');

class Auction{

    readonly organizations: Organizations
    readonly socket;

    constructor() {
        this.organizations = new Organizations(data.participates)
    }

}

export const db = new Auction();
