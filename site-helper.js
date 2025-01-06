import { searchByBarcode } from "./barcode-scanner-helper.js";

document.addEventListener('keydown', function(event) {
    // Code to execute when a key is pressed
    console.log(event.key); // Logs the pressed key
    if(event.key == '/' && event.target == null)
    {
        var inp = document.createElement("input");
        inp.style.display = "none";
        document.body.appendChild(inp);
        inp.focus();
        inp.addEventListener("keydown", function(e) {
            if(e.code == 'Enter')
            {
                searchByBarcode(inp.value);
                inp.remove();
            }
        });
    }
  });