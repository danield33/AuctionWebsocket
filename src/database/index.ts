import {Organizations} from "./models/organizations";
import './firebase';
import { initializeApp } from "firebase/app";
import {app, firebaseConfig} from "./firebase";
import firebase from "firebase/compat";


class Auction {

    organizations: Organizations;

    constructor() {
        this.organizations = new Organizations()
    }

}

export const db = new Auction();
