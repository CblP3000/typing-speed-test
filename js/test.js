class Test {
    constructor() {
        // console.log("result test 'GetText':", this.GetText());   
        // console.log("result test 'TextToLine':", this.TextToLine());
        // console.log("result test 'Statistics':", this.Statistics());
        // this.testText();
    }

    TextToLine() {
        const theClass = new TextToLine()
        const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        const result = theClass.wrap(text, { width: 20 }); 
        const outputData = `Lorem ipsum dolor\nsit amet,\nconsectetur\nadipiscing elit, sed\ndo eiusmod tempor\nincididunt ut labore\net dolore magna\naliqua.`;
        console.log(result);
        return result === outputData;
    }

    TextToLine2() {
        const theClass = new TextToLine({width: 20})
        const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        const result = theClass.updateLines(text); 
        const outputData = `Lorem ipsum dolor\nsit amet,\nconsectetur\nadipiscing elit, sed\ndo eiusmod tempor\nincididunt ut labore\net dolore magna\naliqua.`;
        console.log(result);
        return result === outputData;
    }

    Wordwrap() {
        const wordwrap = new Wordwrap();
        const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        const result = wordwrap.wrap(text, { width: 20 })
        const outputData = `Lorem ipsum dolor\nsit amet,\nconsectetur\nadipiscing elit, sed\ndo eiusmod tempor\nincididunt ut labore\net dolore magna\naliqua.`;
        console.log(result);
        return result === outputData;
    }

    async GetText() {
        const theClass = new GetText();
        const text = `Скромная девушка приглашает парня в гости на чай. Он приходит с двумя бутылками коньяка. Она:
– Я же тебя на чай приглашала!
Он:
– Ну это… Ты сказала сама, что к чаю… это, где оно тут…
Вытаскивает из кармана замученную ириску:
– Вот! Конфеты с коньяком!`;
        await theClass.getText();
        const result = await theClass.getText();
        console.log(theClass.texts)
        console.log(result);
        return text === result;
    }

    async Statistics() {
        const stats = new Statistics();
        stats.start();           
        stats.error();           
        stats.error();           

        const testLine = "12";

        return new Promise((resolve)=>setTimeout(()=>{
            stats.endLine(testLine)
            const result = Number(elements.speedValue.textContent);
            resolve(result > 58 || result < 62)
        }, 2000));
    }

    testText() {
        const old = switchLine.switch;
        switchLine.switch = async function() {
            await old();
            inputStatus.line = "test"; 
            inputStatus.update(); 
            //elements.value.textContent = "tes";
        }
        inputStatus.switchLine = switchLine.switch;
        setTimeout(switchLine.switch, 100)
    }
}

const test = new Test();
