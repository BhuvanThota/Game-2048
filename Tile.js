
export default class Tile{
    #tileElement
    #x
    #y
    #value

    constructor(tileContainer, value = Math.random() > .5 ? 2: 4 ){

        this.#tileElement = document.createElement("div")
        this.#tileElement.classList.add('tile')
        tileContainer.append(this.#tileElement)
        this.value = value
    }

    get value(){
        return this.#value
    }

    set x(value){
        this.#x = value
        this.#tileElement.style.setProperty("--x", value)
    }
    set y(value){
        this.#y = value
        this.#tileElement.style.setProperty("--y", value)
    }

    set value(v){
        this.#value = v
        this.#tileElement.textContent = v
        const power = Math.log2(v)
        let numColor = "#000";
        if (power >= 9) {
            numColor = "#FFF";
        }else if( power > 5 && power < 9 ){
            numColor = "#fe072c";
        }else if( power > 3 && power < 6 ){
            numColor = "#98021b";
        }else{
            numColor = "#000";
        }
        const bgHue = Math.floor(15 + power * 3) 
        const bgSat = 50 + power * 6
        const bgLight = Math.floor(100 - power * 4.75)
         
        this.#tileElement.style.setProperty("--bg-hue", `${bgHue}`)
        this.#tileElement.style.setProperty("--bg-sat", `${bgSat}%`)
        this.#tileElement.style.setProperty("--bg-light", `${bgLight}%`)
        this.#tileElement.style.setProperty("--num-color", numColor )
    }

    remove(){
        this.#tileElement.remove()
    }

    waitForTransition(animation = false){
        return new Promise(resolve =>{
            this.#tileElement.addEventListener(animation ? "animationend" :"transitionend", resolve, {
                once: true,
            })
        }
        )
    }
}