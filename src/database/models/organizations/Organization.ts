const fs = require('fs');
const data = require('../MockData.json');
const atob = require('atob');
const ImageDataURI = require('image-data-uri');

export interface OrganizationObj{
    name: string;
    id: string;
    image: string;
    description: string;
}

export class Organization{

    name: string;
    id: string;
    private _image: string;
    description: string;

    constructor(organization: OrganizationObj) {
        this.name = organization.name;
        this.id = organization.id;
        this.description = organization.description;

        if(organization.image.startsWith("data"))
            this._image = '../../../images/'+this.id+'.jpg';

    }

    save(){
        data.participates[this.id] = this;
        fs.writeFileSync(__dirname+'/../MockData.json', JSON.stringify({
            name: this.name,
            id: this.id,
            description: this.description
        }, null, 2), 'utf-8');
        this.saveImage();
    }

    saveImage(){
        fs.createWriteStream('images/'+this.id+'.jpg').write(this._image);
    }


    async getImage(): Promise<string> {
        return await ImageDataURI.encodeFromFile('../../../images/'+this.id+'.jpg')
    }

    set image(val){
        this.dataURLtoFile(val);
    }

    private dataURLtoFile(dataURI: string){
        ImageDataURI.outputFile(dataURI, '../../../images/'+this.id+'.jpg')
    }

}
