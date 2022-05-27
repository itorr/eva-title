
const style = document.createElement('style');
document.head.appendChild(style);
let fontAPI = 'http://192.168.31.7:8003/api/fontmin';
// fontAPI = 'https://eva-title.vercel.app/api/fontmin';
const getFontFromText = (name,text,onOver=_=>{})=>{
    text = text.replace(/\s/g,'');
    text = Array.from(new Set(text)).sort().join('');
    console.log(str2utf8(text))
    console.log(utf82str(str2utf8(text)))
    const unicode = str2utf8(text).join()
    const fontURL = `${fontAPI}?name=${name}&unicode=${unicode}`;

    loadFont(name,fontURL,_=>{
        onOver(_)
        // style.innerHTML = `html {font-family: a123;}`;
    })
}
const loadFont = async (fontName,fontURL,callback) => {
	const fontFace = new FontFace(fontName, `url(${fontURL})`);
	fontFace.load().then(fontFace => {
		document.fonts.add(fontFace);
		callback(fontFace);
	});
};
function str2utf8(str) {
    return str.split('').map(s=>s.charCodeAt(0))
}
function utf82str(str) {
    return String.fromCharCode.apply(null,Array.from(str))
}


const inputEl = document.querySelector('textarea');
const checkboxEl = document.querySelector('input');
const outputEl = document.querySelector('div');

const s = '沉值'
const t = '沈値'
const c = _=>{
    let v = inputEl.value.trim()
    if(checkboxEl.checked) v = transformFunc[2](v)

    v += layouts.map(a=>[a.inputs.map(t=>t.placeholder),a.exemples]).flat().join()

    getFontFromText(fontFamilyName,v,async _=>{
        // outputEl.innerText = v
        outputEl.innerHTML = '';
        layouts.slice().sort(_=>-1).forEach((layout,index)=>{
            let texts = [
                // '使徒',
                // '襲来',
                // '第壱話',
            ];
            texts = layout.inputs.map((input,index)=>{
                return texts[index] || input.placeholder
            })
            const height = 360;
            const el = make({
                texts,
                config:{
                    height: !index?(height*2+8):height,
                    // convolute: true,
                    blur:1,
                    // inverse: true,
                },
                layout
            })
            outputEl.appendChild(el)

            if(layout.exemples){
                layout.exemples.forEach(texts=>{
                    const el = make({
                        texts,
                        config:{
                            height,
                            blur:1,
                        },
                        layout
                    })
                    outputEl.appendChild(el)
                })
            }
        })
    })
}
inputEl.oninput = _=>{
    clearTimeout(c.t)
    c.t = setTimeout(c,1000)
}
checkboxEl.oninput = c;


fetch('input.txt').then(r=>r.text()).then(text=>{
    inputEl.value = text
    c();
})

document.querySelector('button').onclick = c