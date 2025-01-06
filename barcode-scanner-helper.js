export function searchByBarcode(barcodeValue) {
    var newPath = "/products-by-barcode/" + encodeURI(barcodeValue);
    if(barcodeValue.startsWith("ST-"))
    {
      newPath = "/node/" + encodeURI(barcodeValue.replace("ST-", ""));
    }
    var l = window.location;
    window.location.href = l.origin + newPath;
  }
