import { GetAsElement } from "./html-helper.js"
var html = `
<div id="product-detail-photo-carousel" class="carousel slide rootdiv">
  <div class="carousel-inner">

  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
`;

/*    <div class="carousel-item active">
      <img src="..." class="d-block w-100">
    </div>
*/
export function CreateCarousel(imageTags) {
    var element = GetAsElement(html, "rootdiv");
    var imageWrapper = element.getElementsByClassName("carousel-inner")[0];

    for(var i = imageTags.length - 1; i >= 0; i--) {
        var carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if(i == 0) carouselItem.classList.add("active");
        imageTags[i].classList.add("d-block");
        imageTags[i].classList.add("w-100");
        imageTags[i].removeAttribute("width");
        imageTags[i].removeAttribute("height");
        
        carouselItem.append(imageTags[i]);
        imageWrapper.prepend(carouselItem);
        
    }

    return element;
}
