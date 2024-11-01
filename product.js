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
     * @returns { number }
     */
    GetCurrentProductId = function() {
        var classes = document.body.classList;
        var classStart = "page-products-";
        var excludeClassStart = "page-products-by";
        for(var i = 0; i < classes.length; i++)
        {
            var c = classes[i];
            if(c.startsWith(classStart) && !c.startsWith(excludeClassStart))
            {
                return Number(c.substring(classStart.length));
            }
        }

        // try to find if on the barcode page
        var elementId = document.getElementsByClassName("product-id-for-barcode");
        if(elementId.length > 0)
            return Number(elementId[0].innerText);
        return null;
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

