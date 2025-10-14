class Notifications {
    constructor(options) {
        Object.assign(this, {
            delay: 5000,           // delay for disapear the notification
            animation: 400,         // deplay for animation
            invisibleClass: "fade-out-ntf",
            notificationTextClass: "message-ntf",
            closeButtonClass: "close-ntf", 
        }, options);
        this.initHandler();
    }

    remove(element) {
        element.classList.add(this.invisibleClass);
        setTimeout(()=>element.remove(), this.animation);
    }

    new(text) {
        const newEl = elements.exampleNotification.cloneNode(true);
        newEl.removeAttribute("style");
        newEl.querySelector("."+ this.notificationTextClass).textContent = text;

        elements.notifications.appendChild(newEl);
        setTimeout(()=>this.remove(newEl), this.delay);
    }

    initHandler() {
        elements.notifications.addEventListener("click", event=>{
            if (event.target.classList.contains(this.closeButtonClass)) 
                this.remove(event.target.parentNode);
        })
    }
}

const notifications = new Notifications();