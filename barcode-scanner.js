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


window['BarcodeDetector'] = barcodeDetectorPolyfill.BarcodeDetectorPolyfill

var innerHtml = document.createElement("html");
innerHtml.innerHTML = htmlText;

var body = document.getElementsByTagName("body");
body[0].appendChild(innerHtml.getElementsByClassName("rootdiv")[0]);
const video = document.getElementById('video');

function searchByBarcode() {
  var barcodeValue = document.getElementById("barcode").value
  var newPath = "/products-by-barcode/" + encodeURI(barcodeValue);
  if(barcodeValue.startsWith("ST-"))
  {
    newPath = "/node/" + encodeURI(barcodeValue.replace("ST-", ""));
  }
  var l = window.location;
  window.location.href = l.origin + newPath;
}
// 14 is UPC_A
document.getElementById("barcodeSubmit").onclick = searchByBarcode;

const barcodeDetector = new BarcodeDetector({ formats: [
  'qr_code', //'code_128',
  'ean_13', 'ean_8',
  'upc_a', 'upc_e'] });

function videoElementScanHandler() {
  const detectBarcodes = async () => {
      try {
          const barcodes = await barcodeDetector.detect(video);
          barcodes.forEach(barcode => {
            //document.getElementById("output").innerText = barcode.rawValue;
            document.getElementById("barcode").value = barcode.rawValue;
            searchByBarcode();
          });
      } catch (err) {
          console.error('Barcode detection failed: ', err);
      }

      // Continue detecting barcodes
      requestAnimationFrame(detectBarcodes);
  };

  detectBarcodes();
}

var videoStream;
var isScanning = false;
var discoveredCameras = false;
var select = document.getElementById("camera-select");


function stopVideo() {
  videoStream.getTracks().forEach( track => track.stop())
  video.srcObject = null;
}

async function startScanning(deviceId) {
  // Get access to the camera
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: deviceId
      }
    });

    video.srcObject = videoStream;
    isScanning = true;
  } catch (err) {
    console.error('Error accessing the camera: ', err);
    return;
  }

  // Detect barcodes in the video feed
  video.addEventListener('play', videoElementScanHandler);
}


async function discoverCameras() {
  try {
    var testStream = await navigator.mediaDevices.getUserMedia({ video: true });
    testStream.getTracks().forEach(track => track.stop());
    var cams = await navigator.mediaDevices.enumerateDevices();
    //alert("Found " + tmp.length + " camera devices. First is: " + tmp[0].label);
    var previousCam = localStorage.getItem("barcode-scanner-last-cam");
    var previousCamExists = false;
    // id, label
    for(var i = 0; i < cams.length; i++) {
      if(cams[i].kind == "videoinput")
      {
        var option = document.createElement("option");
        option.innerText = cams[i].label;
        option.value = cams[i].deviceId;
        if(previousCam !== null && cams[i].deviceId == previousCam)
          previousCamExists = true;
      
        select.appendChild(option);
      }
    }

    if(previousCamExists)
      select.value = previousCam;

    select.onchange = () => {
      var selectedCameraId = select.value;
      localStorage.setItem("barcode-scanner-last-cam", selectedCameraId);
      if(isScanning) {
        stopVideo();
        isScanning = false;
      }

      startScanning(selectedCameraId);
    };
  }
  catch (error)
  {
    alert("Error getting user media: " + error);
  }
}

async function initAndStartScanning() {
  // Create a new BarcodeDetector instance
  if(!discoveredCameras)
  {
    discoveredCameras = true;
    await discoverCameras();
  }

  startScanning(select.value);
} // end of initAndStartScanning()


function closeScanner() {
  if(isScanning) {
    // stop
    stopVideo();
    //video.pause();
    video.removeEventListener("play", videoElementScanHandler);
    isScanning = false;
  }
  var wrapper = document.getElementsByClassName("custom-barcode")[0];
  wrapper.classList.add("inactive");
}

document.getElementById("closeScanner").onclick = () => {
  localStorage.removeItem("barcode-scanner-autostart");
  closeScanner();
}

var openScannerClickEventHandler = function() {
  var wrapper = document.getElementsByClassName("custom-barcode")[0];
  wrapper.classList.remove("inactive");

  localStorage.setItem("barcode-scanner-autostart", "true");

  initAndStartScanning();
}

document.getElementById("openScanner").onclick = openScannerClickEventHandler

if(localStorage.getItem("barcode-scanner-autostart") === "true")
{
  openScannerClickEventHandler();
}

// set focus to input box on page load
//setTimeout(function() {
  document.getElementById("barcode").focus();
//}, 200);