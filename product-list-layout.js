

var items = document.getElementsByClassName("views-view-responsive-grid__item");

for(var i = 0; i < items.length; i++)
{
    var item = items[i];
    item.classList.add("card");
    var img = item.getElementsByTagName("img");
    if(img.length > 0)
        img[0].classList.add("card-img-top");
}