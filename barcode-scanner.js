var htmlText = `
<div class="rootdiv">
<style type="text/css">
  .custom-barcode.outer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000a;
    z-index: 10000;
  }
  
  .custom-barcode .modal-inner {
    position: absolute;
    bottom: 10px;
    left: calc(50% - 150px);
    background-color: #fff;
    border-radius: 5px;
    width: 300px;
  }

  .custom-barcode .modal-title h1 {
    font-size: 20px;
    padding-top: 10px;
    padding-left: 10px;
    margin-bottom: 10px;
    line-height: 20px;
  }
</style>

<div class="custom-barcode outer">
  <div class="modal-inner">
    <div class="modal-title">
      <h1>Barcode Scanner</h1>
    </div>
    <div class="modal-content">
      <div id="barcode-video"></div>
    </div>
    <div class="modal-footer">
      <button class="modal-action mdc-button">Close</button>
    </div>
  </div>
</div>
</div>`;

var innerHtml = document.createElement("html");
innerHtml.innerHTML = htmlText;

//var outer = document.createElement("div");
//outer.insertAdjacentElement("afterend", );
var body = document.getElementsByTagName("body");
body[0].appendChild(innerHtml.getElementsByClassName("rootdiv")[0]);
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

var scanner = new Html5Qrcode("barcode-video", {
  formatsToSupport: [ 14 ]
});

scanner.getCameras().then(function(cams) {
  console.log("Cameras detected", cams);
}, function() {
  console.log("Error getting cameras");
});