import module = require("./module");

export function updateSize(){

    const reader = new FileReader();
    reader.onload = () => {
        const dst = document.getElementById("log");
        let str = reader.result.toString()
        let d = JSON.parse(str);
        dst.innerHTML += d['name'] + "<br>";
        let m = module.parse_module(d);
        m.dump();
    }
    for(let i = 0; i < this.files.length; i++){
        reader.readAsText(this.files[i]);
    }
}
