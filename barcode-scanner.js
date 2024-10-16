var htmlText = `
<div id="rootdiv">
<h1>Hello world!!</h1>
</div>`;

var innerHtml = document.createElement("html");
innerHtml.html(htmlText);

var outer = document.createElement("div");
outer.insertAdjacentElement("afterend", innerHtml.getElementById("rootdiv"));
var body = document.getElementsByTagName("body");
body[0].appendChild(outer);
//outer.insertAdjacentElement("afterend", htmlText);
function onScanSuccess(decodedText, decodedResult) {
    document.getElementById("barcode").value = decodedText;
    document.getElementById("barcodeSubmit").click();
}
// 14 is UPC_A
var html5QrcodeScanner = new Html5QrcodeScanner(
	"qr-reader", { fps: 10, qrbox: 250, formatsToSupport: [ 14 ] });
html5QrcodeScanner.render(onScanSuccess);
document.getElementById("barcodeSubmit").onclick = function() {
  var href = window.location.href;
  var newPath = "/products-by-barcode/" + encodeURI(document.getElementById("barcode").value);
  window.location.href = href.replace(window.location.pathname, newPath);
}
