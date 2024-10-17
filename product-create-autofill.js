

function getQueryParams(filterKey) {
    var q = window.location.search;
    if(q == null || q == undefined || q == "")
        return [];
    if(q.startsWith("?"))
        q = q.substring(1);

    var result = [];
    var params = q.split("&");
    for(var i = 0; i < params.length; i++)
    {
        var t = params[i].split("=");
        if(filterKey === undefined || (filterKey !== undefined && filterKey == t[0]))
        {
            result.push({
                key: t[0],
                value: t[1]
            });
        }
    }
    return result;
}
function populateFields() {

    var el = document.getElementById("edit-field-product-compare-category-0-target-id");
    var tags = getQueryParams("tags")
    // for now, we only are setting the "compare category", so just 1
    if(tags.length > 0)
    {
        var tag = tags[0];
        el.value = tag;
    }
}

if(window.location.pathname == "/node/add/product")
{
    populateFields();
}