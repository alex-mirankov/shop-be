const { v4: uuidv4 } = require('uuid');

module.exports.Product = class {
    constructor(data) {
        this.id = uuidv4();
        this.title = data.title;
        this.description = data.description;
        this.price = data.price;
    }
}
