

var items = document.getElementsByClassName("views-view-responsive-grid__item");

for(var i = 0; i < items.length; i++)
{
    var item = items[i];
    item.classList.add("card");
    item.getElementsByTagName("img")[0].classList.add("card-img-top");
}