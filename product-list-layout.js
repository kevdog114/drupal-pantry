

var items = document.getElementsByClassName("views-view-responsive-grid__item");

items.foreach(item => {
    item.classList.add("card");
    item.getElementsByTagName("img")[0].classList.add("card-img-top");
});