
export class Button
{
    refreshLabel = () => {};
    clickHandler = () => {};

    /**
     * @type { HTMLElement }
     */
    Element

    #label = "";

    get label() {
        return this.#label;
    }

    set label(a) {
        this.#label = a;
        this.Element.innerText = a;
    }

    SetSpinner = function(isVisible) {
        var spinner = this.Element.getElementsByClassName("spinner-border");

        if(!isVisible && spinner.length > 0)
          spinner.remove();
      
        if(spinner.length == 0 && isVisible == true)
        {
          spinner = document.createElement("span");
          spinner.classList.add("spinner-border", "spinner-border-sm");
          this.Element.insertBefore(spinner, this.Element.firstChild);
        }
      }

    OnClick = async function() {
        console.log("click handler", this.clickHandler);
        await this.clickHandler(this);
    }

    RefreshLabel = async function() {
        await this.refreshLabel(this);
    }

    /**
     *
     */
    constructor(refreshLabel_, clickHandler_) {
        console.log("Refresh label", refreshLabel_);
        console.log("Click", clickHandler_);
        this.refreshLabel = refreshLabel_;
        this.clickHandler = clickHandler_;
    }
}

/*

  {
    element: null,
    updateLabel: () => {
      if(!this.element) return;
      if(currentProduct != null && currentProduct.field_shopping_list == true)
        this.element.innerText = "Remove from shopping list";
      else
        this.element.innerText = "Add to shopping list";

      setSpinner(this.element, currentProduct == null);
    },
    onClick: async () => {
      setSpinner(this.element, true);
      var p = await api.GetById(api.GetCurrentProductId());
      p.field_shopping_list = !p.field_shopping_list;
      p.UpdateProperties.field_shopping_list = true;
      console.log("Before update", p);
      p = await api.PatchUpdate(157, p);
      console.log("After update", p);
      setSpinner(this.element, false);
      this.updateLabel();
    }
  }

*/