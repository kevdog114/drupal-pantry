import { CreateCarousel } from "./product-details-carousel.js"
import { Product, ProductAPI } from "./product.js";

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

var productButtons = document.getElementsByClassName("custom-product-add-stock")[0];
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

function labelClickHandler(link) {
  //console.log(link);
  link.onclick = () => {
    
    var stockId = link.getAttribute("data-stock-id");
    var productTitle = link.getAttribute("data-stock-product-title");
    var dueDate = link.getAttribute("data-due-date");
    var quant = link.getAttribute("data-quantity");

    fetch("https://pantry.klschaefer.com/api/label", {
      method: 'POST',
      body: new URLSearchParams({
        "text": "na",
        "font_family": "DejaVu Serif (Book)",
        "font_size": 70,
        "label_size": 62,
        "align": "center",
        "margin_top": 10,
        "margin_bottom": 20,
        "margin_left": 20,
        "margin_right": 20,
        "product": productTitle,
        "duedate": "Use by: " + dueDate + "  Qty: " + quant,
        "grocycode": "ST-" + stockId
      })
    }).then(() => {
      var check = document.createElement("span");
      check.innerHTML = "&check;";
      link.parentElement.prepend(check);
      setTimeout(() => check.remove(), 5000);
    }).catch(() => {
      alert("There was a problem printing the label. Make sure the label printer is nearby.");
    });
  }
}

// set up stock print links
var labelLinks = document.getElementsByClassName("label-print-trigger");
for(var i = 0; i < labelLinks.length; i++)
{
  var link = labelLinks[i];

  labelClickHandler(link);
}

var api = new ProductAPI();
var currentProduct = null;

var setSpinner = function(element, isVisible) {
  var spinner = element.getElementsByClassName("spinner-border");
  console.log("")
  if(!isVisible && spinner.length > 0)
    spinner.remove();

  if(spinner.length == 0 && isVisible == true)
  {
    spinner = document.createElement("span");
    spinner.classList.add("spinner-border", "spinner-border-sm");
    element.insertBefore(spinner, element.firstChild);
  }
}

var buttonsToAdd = [
  {
    element: null,
    updateLabel: function() {
      if(!this.element) return;
      this.element.innerText = "test get";
    },
    onClick: async function() {
      var api = new ProductAPI();
      console.log("Get product", await api.GetById(api.GetCurrentProductId()));
    }
  },
  {
    element: null,
    updateLabel: function() {
      if(!this.element) return;
      if(currentProduct != null && currentProduct.field_shopping_list == true)
        this.element.innerText = "Remove from shopping list";
      else
        this.element.innerText = "Add to shopping list";

      setSpinner(this.element, currentProduct == null);
    },
    onClick: async function() {
      setSpinner(this.element, true);
      var p = await api.GetById(api.GetCurrentProductId());
      p.field_shopping_list = !p.field_shopping_list;
      p.UpdateProperties.field_shopping_list = true;
      console.log("Before update", p);
      p = await api.PatchUpdate(157, p);
      console.log("After update", p);
      setSpinner(this.element, false);
      this.updateLabel();
    }
  }
];

api.GetById(api.GetCurrentProductId()).then(p => {
  currentProduct = p;
  buttonsToAdd.forEach(a => a.updateLabel());
});

for(var i = 0; i < buttonsToAdd.length; i++)
{
  var btn = document.createElement("a");
  btn.classList.add("btn", "btn-primary");
  btn.onclick = buttonsToAdd[i].onClick;
  buttonsToAdd[i].element = btn;
  buttonsToAdd[i].updateLabel();
  productButtons.append(btn);
}


if(images != null) {
  images.remove();
  
  var carouselElement = CreateCarousel(images.getElementsByTagName("img"));
  moveTo("images", carouselElement, false);
  const carousel = new bootstrap.Carousel("#product-detail-photo-carousel");
}