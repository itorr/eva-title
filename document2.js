
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
const checkboxEl = document.querySelector('input');
const outputEl = document.querySelector('#out');

const s = '沉值'
const t = '沈値'
const c = _=>{
    // let v = inputEl.value.trim()
    // if(checkboxEl.checked) v = transformFunc[2](v)

    let v = layouts.map(a=>[a.inputs.map(t=>t.placeholder),a.exemples]).flat().join()

    getFontFromText(fontFamilyName,v,async _=>{
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
                    height: 240,
                    // convolute: true,
                    blur:1,
                    inverse: Math.random()>0.9,
                },
                layout
            })
            const src = makeBMPFormCanvas(el)
            layout.src = src;
            // console.log(src)
            // app.$set(layout,'src',src)
            // outputEl.appendChild(el)

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
                    // outputEl.appendChild(el)
                })
            }
        })

        app.layouts = layouts;

    })
}


c();

const texts = [
    '',
    '',
    '',
    '',
]
const config = {
    blur:true,
    height:480,
    shadow:true,
    convolute: false,
    retina:true,
    inverse: Math.random()>0.9,
};
const types = [
    {
        value: undefined,
        text:'DVD'
    },
    {
        value: 95,
        text: '95'
    }
]
const data ={
    layout:layouts[0],
    layouts:deepCopy(layouts),
    config,
    texts
}

const app = new Vue({
    el:'.app',
    data,
    methods:{
        make(){
            clearTimeout(make.timer);

            make.timer = setTimeout(_=>{
                const texts = this.layout.inputs.map((input,index)=>{
                    return this.texts[index] || input.placeholder
                });

                getFontFromText(fontFamilyName,texts.join(''), make.bind(null,{
                    canvas: this.$refs['canvas'],
                    texts,
                    config: this.config,
                    layout: this.layout
                }));
            },200);
        }
    },
    watch:{
        config:{
            deep:true,
            handler:'make'
        },
        layout:'make',
        texts:{
            deep:true,
            handler:'make'
        },
    },
    created(){

    }
})

