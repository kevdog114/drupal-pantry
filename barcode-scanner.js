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
  .custom-barcode.outer.inactive {
    display: none;
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

<div class="custom-barcode outer inactive">
  <div class="modal-inner">
    <div class="modal-title">
      <h1>Barcode Scanner</h1>
    </div>
    <div class="modal-content">
      <div id="barcode-video"></div>
    </div>
    <div class="modal-footer">
      <select id="camera-select">
      </select>
      <button class="modal-action mdc-button" id="closeScanner">Close</button>
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
  console.log("Scanned barcode", { decodedText: decodedText, decodedResult: decodedResult });
    document.getElementById("barcode").value = decodedText;
    document.getElementById("barcodeSubmit").click();
}

// 14 is UPC_A
document.getElementById("barcodeSubmit").onclick = function() {
  var href = window.location.href;
  var newPath = "/products-by-barcode/" + encodeURI(document.getElementById("barcode").value);
  window.location.href = href.replace(window.location.pathname, newPath);
}

var scanner = new Html5Qrcode("barcode-video", {
  formatsToSupport: [ 14 ]
});

Html5Qrcode.getCameras().then(function(cams) {
  // id, label
  var select = document.getElementById("camera-select");
  for(var i = 0; i < cams.length; i++) {
    var option = document.createElement("option");
    option.innerText = cams[i].label;
    option.value = cams[i].id;
    select.appendChild(option);
  }
  select.onchange = function() {
    var value = select.value;
    console.log("Select changed", value);
    if(scanner.isScanning)
      scanner.stop();
    scanner.start(value, undefined, onScanSuccess);
  }
}, function() {
  console.log("Error getting cameras");
});


//var scripts = document.getElementsByTagName("script")
//var currentScript = scripts[scripts.length - 1];
//var scriptParent = currentScript.parentElement;

document.getElementById("closeScanner").onclick = function() {
  var wrapper = document.getElementsByClassName("custom-barcode")[0];
  wrapper.classList.add("inactive");
}

document.getElementById("openScanner").onclick = function() {
  var wrapper = document.getElementsByClassName("custom-barcode")[0];
  wrapper.classList.remove("inactive");
}