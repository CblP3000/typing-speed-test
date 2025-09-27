class LanguageSwitcher {
    constructor() {
        this.initHandler();
    }

    initHandler() {
        elements.languageSwitcher.addEventListener("click", event=>{
            elements.languageSwitcher.toggleAttribute("isEnabled");
            
            if (event.target.classList.contains("list-item-SP")) {
                packageOfTexts.setLang(
                    event.target.getAttribute("value")
                );
                elements.selectLang.textContent = event.target.textContent;
            }
        });
    }
}


const languageSwitcher = new LanguageSwitcher();