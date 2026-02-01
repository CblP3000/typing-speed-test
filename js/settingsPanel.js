class LanguageSwitcher {
    constructor(options={}) {
        Object.assign(this, {
            classItem: "list-item-SP",
            classLangItem: "lang-SP",
            classUploadFile: "uff-SP",
        }, options)

        this.lastLangItem =
            elements.languageSwitcher.querySelector(
                `[value="${packageOfTexts.lang}"]`
            );

        this.updateName = this.updateName.bind(this);
        this.updateName();
        this.initHandler();
    }

    initHandler() {
        elements.languageSwitcher.addEventListener("click", event=>{
            elements.languageSwitcher.toggleAttribute("isEnabled");
            const hasClass = e=>event.target.classList.contains(e);
            
            if (hasClass(this.classItem)) {
                elements.selectLang.textContent = event.target.textContent;

                if (hasClass(this.classLangItem)) {
                    this.lastLangItem = event.target;
                    packageOfTexts.setLang(event.target.getAttribute("value"));
                }
                else if (hasClass(this.classUploadFile)) 
                    uploadFile.request();
            }
        });
    }

    updateName() {
        elements.selectLang.textContent = this.lastLangItem.textContent; 
    }
}


class UploadFile {
    constructor() {
        this.isActive = false;
        elements.uploadedFiles.addEventListener("change", ()=>{
            const file = elements.uploadedFiles.files[0];
            if (file) 
                file.text()
                    .then(textToLine.updateLines)
                    .then(switchLine.uploadText)
                    .catch(console.error);
        });
    }

    async get() {
        return elements.uploadedFiles.files[0].text();
    }

    request() {
        elements.uploadedFiles.click();
    }
}

function initHandlerBtnImg(pathOn, pathOff, button, handler) {
    button.addEventListener("click", (event) => {
        const enabled = button.toggleAttribute("isEnabled");
        button.src = enabled ? pathOn : pathOff;
        handler && handler(event, button);
    });
}

initHandlerBtnImg("assets/dark-mode-toggle-on.opt.svg", "assets/dark-mode-toggle-off.opt.svg", elements.themeSwitcher, 
    (_, button)=>{
        const whiteTheme = "theme-white";
        const classList = document.body.classList;
        if (button.hasAttribute("isEnabled"))
            classList.remove(whiteTheme);
        else {
            classList.add(whiteTheme);
        }
    }
);

const languageSwitcher = new LanguageSwitcher();
const uploadFile = new UploadFile();