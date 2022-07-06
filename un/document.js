
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

    getFontFromText(fontFamilyName,v,async _=>{
        // outputEl.innerText = v
        outputEl.innerHTML = '';
        v.split(/\n\n/g).forEach(v=>{
            const el = make(v)
            outputEl.appendChild(el)
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