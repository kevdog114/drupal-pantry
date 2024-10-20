import { CreateCarousel } from "./product-details-carousel.js"

var layoutHtml = `
<div class="rootdiv custom-product-layout">
  <div id="product-title">
    <!-- title -->
  </div>
  <div class="row">
    <div class="col-sm-8">
      <div class="stock"></div>
      <div class="images"></div>
    </div>
    <div class="col-sm-4">
      <div class="barcodes"></div>
      <div class="related"></div>
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

var moveTo = function(key, el, removeFromExisting) {
    var outer = document.getElementsByClassName("custom-product-layout")[0];
    var dest = outer.getElementsByClassName(key);
    if(dest.length > 0 && el != null){
        if(removeFromExisting) el.remove();
        
        dest[0].append(el);
    }
}

var addStock = byClass("custom-product-add-stock");
var editLink = byClass("custom-product-edit");
var title = byClass("custom-product-title");
var relatedProducts = byClass("custom-product-related");
var barcodes = byClass("custom-product-barcodes");
var stock = byClass("custom-product-stock");
var images = byClass("custom-product-images");

var container = title.parentElement;
container.append(layoutElementHtml.getElementsByClassName("rootdiv")[0]);

moveTo("product-title", title, true);
moveTo("stock", stock, true);
moveTo("barcodes", barcodes, true);
moveTo("related", relatedProducts, true);
//moveTo("images", images);
images.remove();


var carouselElement = CreateCarousel(images.getElementsByTagName("img"));
moveTo("images", carouselElement, false);