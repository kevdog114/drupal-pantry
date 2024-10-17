

function populateFields() {
    var el = document.getElementById("edit-field-product-compare-category-0-target-id");
    el.value = "hello world";
}

if(window.location.pathname == "/node/add/product")
{
    populateFields();
}