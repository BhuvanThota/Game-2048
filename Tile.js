export default class Tile{
    #tileElement
    #x
    #y
    #value

    constructor(tileContainer, value = Math.random() > .5 ? 2:4){
        this.#tileElement = document.createElement("div")
        this.#tileElement.classList.add('tile')
        tileContainer.append(this.#tileElement)
        this.value = value 
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
        const bgHue = 18 + power * 3
        const bgSat = 40 + power * 5
        const bgLight = Math.floor(80 - power * 3)
        this.#tileElement.style.setProperty("--bg-hue", `${bgHue}`)
        this.#tileElement.style.setProperty("--bg-sat", `${bgSat}%`)
        this.#tileElement.style.setProperty("--bg-light", `${bgLight}%`)

    }
}