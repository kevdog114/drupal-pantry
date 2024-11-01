/**
 * @typedef {
 *  
 * } 
 */

export class Product {
    UpdateProperties = {
        field_shopping_list: false,
        field_product_text_barcode: false
    };

    /**
     * @type {boolean}
     */
    field_shopping_list;

    /**
     * @type { Array<string> }
     */
    field_product_text_barcode = [];

    FromApi = function(api) {
        if(api.field_shopping_list.length > 0)
            this.field_shopping_list = api.field_shopping_list[0].value;

        this.field_product_text_barcode = api.field_product_text_barcode.map(a => a.value);
    }
}

export class ProductAPI {
    #getToken = async function () {
        var result = await fetch("/session/token?_format=json", { method: "GET" });
        return await result.text();
    }

    #nodeUrl = function (id) {
        return "/node/" + id + "?_format=json";
    }

    /**
     * 
     * @param {Product} product
     * @returns { string } 
     */
    #getPatchBody = function(product) {
        var body = {
            type: [
                {
                    target_id: "product"
                }
            ]
        };

        if(product.UpdateProperties.field_shopping_list)
        {
            body.field_shopping_list = [ {value: product.field_shopping_list }];
        }
        if(product.UpdateProperties.field_product_text_barcode)
        {
            body.field_product_text_barcode = product.field_product_text_barcode.map(a => {
                return {
                    value: a
                }
            });
        }

        return JSON.stringify(body);
    }

    /**
     * 
     * @param { number } id
     * @returns { Product } 
     */
    GetById = async function (id) {
        var result = await fetch(this.#nodeUrl(id), { method: "GET" });
        
        var p = new Product();
        p.FromApi(await result.json());
        return p;
    }

    /**
     * 
     * @param { number } id
     * @param { Product } product
     * @returns { Product } 
     */
    PatchUpdate = async function (id, product) {
        var result = await fetch(this.#nodeUrl(id), {
            body: this.#getPatchBody(product),
            headers: {
                'content-type': 'application/json',
                'X-CSRF-Token': await this.#getToken()
            },
            method: "PATCH"
        });

        var p = new Product();
        p.FromApi(await result.json());
        return p;
    }
}

