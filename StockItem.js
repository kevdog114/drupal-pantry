

export class StockItem {
    UpdateProperties = {
        field_almost_out: false,
        field_is_frozen: false,
        field_stock_due_date: false,
        field_unit_amount: false
    };

    /**
     * @type {boolean}
     */
    field_almost_out;

    /**
     * @type {boolean}
     */
    field_is_frozen;

    /**
     * @type {string}
     */
    field_stock_due_date;

    /**
     * @type {number}
     */
    field_unit_amount;
    
    FromApi = function (api) {
        var getSingleVal = function (api, key, formatter) {
            if(formatter == undefined) formatter = (a) => a;

            if (api[key] != null && api[key].length > 0)
                return formatter(api[key][0].value);
        }

        this.field_almost_out = getSingleVal(api, 'field_almost_out');
        this.field_is_frozen = getSingleVal(api, "field_is_frozen");
        this.field_stock_due_date = getSingleVal(api, "field_stock_due_date");
        this.field_unit_amount = getSingleVal(api, "field_unit_amount", Number.parseFloat);
    }
}

export class StockItemAPI {
    #getToken = async function () {
        var result = await fetch("/session/token?_format=json", { method: "GET" });
        return await result.text();
    }

    #nodeUrl = function (id) {
        return "/node/" + id + "?_format=json";
    }

    /**
     * 
     * @param {StockItem} stockItem
     * @returns { string } 
     */
    #getPatchBody = function (stockItem) {
        var body = {
            type: [
                {
                    target_id: "stock_item"
                }
            ]
        };

        if (stockItem.UpdateProperties.field_almost_out)     body.field_almost_out     = [{ value: stockItem.field_almost_out     }];
        if (stockItem.UpdateProperties.field_is_frozen)      body.field_is_frozen      = [{ value: stockItem.field_is_frozen      }];
        if (stockItem.UpdateProperties.field_stock_due_date) body.field_stock_due_date = [{ value: stockItem.field_stock_due_date }];
        if (stockItem.UpdateProperties.field_unit_amount)    body.field_unit_amount    = [{ value: stockItem.field_unit_amount    }];

        return JSON.stringify(body);
    }

    /**
     * 
     * @param { number } id
     * @returns { StockItem } 
     */
    GetById = async function (id) {
        var result = await fetch(this.#nodeUrl(id), { method: "GET" });

        var p = new StockItem();
        p.FromApi(await result.json());
        return p;
    }

    /**
     * 
     * @param { number } id
     * @param { StockItem } product
     * @returns { StockItem } 
     */
    PatchUpdate = async function (id, stockItem) {
        var result = await fetch(this.#nodeUrl(id), {
            body: this.#getPatchBody(stockItem),
            headers: {
                'content-type': 'application/json',
                'X-CSRF-Token': await this.#getToken()
            },
            method: "PATCH"
        });

        var p = new StockItem();
        p.FromApi(await result.json());
        return p;
    }
}

