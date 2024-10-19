var layoutHtml = `
<div class="rootdiv custom-product-layout">
  <div id="product-title">
    <!-- title -->
  </div>
  <div class="row">
    <div class="col-sm-8">
      <div class="stock"></div>
    </div>
    <div class="col-sm-4">
      <div class="barcodes"></div>
    </div>
  </div>
</div>
`;

var layoutElementHtml = document.createElement("html");
layoutElementHtml.innerHTML = layoutHtml;

/**
 * 
 * @param {*} key 
 * @returns HTMLElement
 */
var byClass = function(key) {
    var r = document.getElementsByClassName(key);
    if(r.length > 0) return r[0].closest(".views-field");
    else return null;
}

var moveTo = function(key, el) {
    var outer = document.getElementsByClassName("custom-product-layout")[0];
    var dest = outer.getElementsByClassName(key);
    if(dest.length > 0 && el != null){
        el.remove();
        dest[0].append(el);
    }
}

var title = byClass("custom-product-title");
var editLink = byClass("custom-product-edit");
var relatedProducts = byClass("custom-product-related");
var barcodes = byClass("custom-product-barcodes");
var addStock = byClass("custom-product-add-stock");
var stock = byClass("custom-product-stock");
var images = byClass("custom-product-images");

var container = title.parent;
container.append(layoutElementHtml.getElementsByClassName("rootdiv")[0]);


moveTo("product-title", title);
moveTo("stock", stock);
moveTo("barcodes", barcodes);

console.log("HTML objects", {
  title: title,
editLink: editLink,
relatedProducts: relatedProducts,
barcodes: barcodes,
addStock: addStock,
stock: stock,
images: images
});