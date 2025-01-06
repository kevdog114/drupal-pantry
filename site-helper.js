import { searchByBarcode } from "./barcode-scanner-helper.js";
import { Button } from "./button.js";

document.addEventListener('keydown', function(event) {
    // Code to execute when a key is pressed
    console.log(event.key); // Logs the pressed key
    if(event.key == '/' && (event.target == null || event.target.tagName.toLowerCase() != 'input'))
    {
        var inp = document.createElement("input");
        //inp.style.display = "none";
        document.body.append(inp);
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