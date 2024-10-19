

var items = document.getElementsByClassName("views-view-responsive-grid__item");

/*
<div class="card-body">
  <h5 class="card-title">Smartfood White Cheddar</h5>
  <h6 class="card-subtitle mb-2 text-body-secondary">Exp: 2024-10-31</h6>
</div>
*/

var moveElement = function(containerElement, destKey, el) {
    var dest = containerElement.getElementsByClassName(destKey);
    if(dest.length > 0 && el != null){
        el.remove();
        dest[0].append(el);
    }
}

for(var i = 0; i < items.length; i++)
{
    var item = items[i];
    item.classList.add("card");
    var cardBodyHtml = `
<div class="card-body">
  <h5 class="card-title product-title"></h5>
  <h6 class="card-subtitle mb-2 text-body-secondary product-exp"></h6>
</div>
    `;
    var cardBodyElementContainer = document.createElement("html");
    cardBodyElementContainer.innerHTML = cardBodyHtml;
    item.append(cardBodyElementContainer.getElementsByClassName("card-body")[0]);

    var img = item.getElementsByTagName("img");
    var title = item.getElementsByClassName("views-field-title");
    var quantity = item.getElementsByClassName("views-field-field-unit-amount");
    var exp = item.getElementsByClassName("views-field-field-stock-due-date");
    

    if(img.length > 0)      img[0].classList.add("card-img-top");

    if(title.length > 0)    moveElement(item, "product-title", title[0]);
    if(quantity.length > 0) moveElement(item, "product-exp", quantity[0]);
    if(exp.length > 0)      moveElement(item, "product-exp", exp[0]);

    if(exp.length > 0)
    {
        var expDate = exp[0].getElementsByTagName("time");
        if(expDate.length > 0)
        {
            var expDateAsDate = new Date(expDate[0].attributes.datetime.value);

            var dateDiff = Math.round((expDateAsDate - new Date()) / (1000 * 60 * 60 * 24));
            
            if(datediff <= 0)
                item.classList.add("text-bg-danger");
            else if(datediff < 30)
                item.classList.add("text-bg-warning");
        }
    }
}