
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

    let v = layouts.map(a=>[a.inputs.map(t=>t.placeholder),a.exemples]).flat().join();

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
            const height = 240;
            const config = Object.assign({},defaultConfig,layout.config,{
                height,
                // convolute: true,
                noise:false,
                blur:1,
                // inverse: Math.random()>0.9,
            });
            const el = make({
                texts,
                config,
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
                        config,
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
const defaultConfig = {
    blur:true,
    height:480,
    shadow:true,
    convolute: false,
    retina:true,
    plan:undefined,
    noise:false,
    // inverse:false,// Math.random()>0.9,
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
const plans = [
    {
        value:undefined,
        text:'黑底'
    },
    {
        value:'white',
        text:'白底'
    },
    {
        value:'red',
        text:'红字'
    }
]
const data ={
    layout:null,
    layouts:deepCopy(layouts),
    config:deepCopy(defaultConfig),
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
                    const {type} = input;
                    if(type==='tab'){
                        return this.texts[index];
                    }
                    return this.texts[index] || input.placeholder
                });

                getFontFromText(fontFamilyName,texts.join(''), make.bind(null,{
                    outputCanvas: this.$refs['canvas'],
                    texts,
                    config: this.config,
                    layout: this.layout
                }));
            },200);
        },
        setLayout(_layout){
            this.layout = _layout;
            const {inputs,config} = _layout;
            console.log(Object.assign({},defaultConfig,config))
            this.config = Object.assign({},defaultConfig,config);
            this.setDefaultTexts(_layout);
        },
        setExemple(exemple){
            console.log({exemple})
            exemple.forEach((t,i)=>{
                // this.texts[i]=t
                this.$set(this.texts,i,t);
                // this.texts[i]=t
            })
        },
        setDefaultTexts(layout){
            const {inputs} = layout;
            this.texts = inputs.map(input=>{
                const {type} = input;
                if(type === 'tab'){
                    return 0//input.options[0]
                }
                return '';
            })
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

