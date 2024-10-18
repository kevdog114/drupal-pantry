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
      <div id="barcode-video">
        <video playsinline id="video" autoplay></video>
        <div id="output"></div>
      </div>
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
const video = document.getElementById('video');

// 14 is UPC_A
document.getElementById("barcodeSubmit").onclick = function() {
  var newPath = "/products-by-barcode/" + encodeURI(document.getElementById("barcode").value);
  var l = window.location;
  window.location.href = l.origin + newPath;
}



var scanner = new Html5Qrcode("barcode-video", {
  formatsToSupport: [ 14 ]
});

function startScanning() {
  var select = document.getElementById("camera-select");
  if(select.value !== null)
    scanner.start(select.value, undefined, onScanSuccess);
}

var discoveredCameras = false;
async function initAndStartScanning() {
  // Create a new BarcodeDetector instance

  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    var cams = await navigator.mediaDevices.enumerateDevices();
    //alert("Found " + tmp.length + " camera devices. First is: " + tmp[0].label);
    var previousCam = localStorage.getItem("barcode-scanner-last-cam");
    var previousCamExists = false;
    // id, label
    var select = document.getElementById("camera-select");
    for(var i = 0; i < cams.length; i++) {
      if(cams[i].kind == "videoinput")
      {
        var option = document.createElement("option");
        option.innerText = cams[i].label;
        option.value = cams[i].id;
        if(previousCam !== null && cams[i].id == previousCam)
          previousCamExists = true;
      
        select.appendChild(option);
      }
    }
  }
  catch (error)
  {
    alert("Error getting user media: " + error);
  }

  const barcodeDetector = new BarcodeDetector({ formats: [
    'qr_code', //'code_128',
    'ean_13', 'ean_8',
    'upc_a', 'upc_e'] });

  // Get access to the camera
  try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true});
      video.srcObject = stream;
  } catch (err) {
      console.error('Error accessing the camera: ', err);
      return;
  }
  // Detect barcodes in the video feed
  video.addEventListener('play', () => {
    const detectBarcodes = async () => {
        try {
            const barcodes = await barcodeDetector.detect(video);
            barcodes.forEach(barcode => {
                console.log('Detected barcode:', barcode.rawValue);
                document.getElementById("output").innerText = barcode.rawValue;
                alert("Detected barcode " + barcode.rawValue);
            });
        } catch (err) {
            console.error('Barcode detection failed: ', err);
            alert("Failed to detect barcode: " + err);
        }

        // Continue detecting barcodes
        requestAnimationFrame(detectBarcodes);
    };

    detectBarcodes();
});
}


document.getElementById("closeScanner").onclick = function() {
  if(scanner.isScanning)
    scanner.stop();
  var wrapper = document.getElementsByClassName("custom-barcode")[0];
  wrapper.classList.add("inactive");
}

document.getElementById("openScanner").onclick = function() {
  var wrapper = document.getElementsByClassName("custom-barcode")[0];
  wrapper.classList.remove("inactive");

  initAndStartScanning();
}

// set focus to input box on page load
//setTimeout(function() {
  document.getElementById("barcode").focus();
//}, 200);