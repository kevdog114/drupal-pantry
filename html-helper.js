
export function GetAsElement(html, rootElementClass)
{
    var layoutElementHtml = document.createElement("html");
    layoutElementHtml.innerHTML = html;
    return layoutElementHtml.getElementsByClassName(rootElementClass)[0];
}
