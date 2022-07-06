
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


const deepCopy=o=>JSON.parse(JSON.stringify(o));

const inputEl = document.querySelector('textarea');
const outputEl = document.querySelector('#out');

const c = _=>{
    let v = inputEl.value.trim()

    v = transformFunc[2](v)
    
    getFontFromText('RaglanStdUB',v,async _=>{
        

    })
}


c();