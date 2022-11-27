
const htmlEl = document.documentElement;
const isChrome = /Chrome/.test(navigator.userAgent);

htmlEl.setAttribute('data-is-chrome',isChrome);

const style = document.createElement('style');
document.head.appendChild(style);
// let fontAPI = 'http://192.168.31.7:8003/api/fontmin';
let fontAPI = `https://${location.hostname}/api/fontmin`;

// fontAPI = 'https://s6.magiconch.com/api/fontmin';
// fontAPI = 'http://localhost:60912/api/fontmin';

// fontAPI = 'https://eva-title-server.vercel.app/api/fontmin';

const blockMojiRegex = /\s/g;


const checkFont = (fontName,weight=100)=>{
    const canvas = document.createElement('canvas');
    const w = 18;
    canvas.width = w;
    canvas.height = w;
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    ctx.font = `${weight} ${w}px ${fontName},sans-serif`;
    ctx.fillStyle = '#000';
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.clearRect(0,0,w,w);
    ctx.fillText(
        '饑',
        0, w
    );
    const pixel = ctx.getImageData(0,0,w,w);
    const d = pixel.data;

    let aa =  0;
    for(let i=0;i<d.length;i+=4){
        aa += d[i+3];
    }

    const l = aa/w/w;
    document.body.removeChild(canvas);
    return l;
};

let haveMatisse = checkFont('EVA_Matisse_Classic-EB,MatissePro-EB') > 120;
let haveSourceHanSerifCNHeavy = checkFont('SourceHanSerifCN-Heavy',800) > 150;


let debug = /192\.168/.test(location.origin);


if(debug){
    // fontWeight = 100;
    fontAPI = 'http://localhost:60912/api/fontmin';
    haveMatisse = false;
    // baseFontFamilyName = 'baseSplit,serif';
}


const getFontFromText = (name,text,onOver=_=>{})=>{
    if(!text) return requestAnimationFrame(onOver);
    if(haveMatisse) return requestAnimationFrame(onOver);

    text = text.replace(blockMojiRegex,'');
    text += '0';
    text = Array.from(new Set(text)).sort().join('');
    // console.log(str2utf8(text))
    // console.log(utf82str(str2utf8(text)))
    text = diffDefaultMoji(text);
    // console.log({text})
    if(!text) return requestAnimationFrame(onOver);

    const unicode = str2utf8(text).join();
    const fontURL = `${fontAPI}?name=${name}&unicode=${unicode}`;

    loadFont(name,fontURL,_=>{
        onOver(_)
        // style.innerHTML = `html {font-family: a123;}`;
    })
}
const loadFont = async (fontName,fontURL,callback) => {
    if(haveMatisse) return requestAnimationFrame(callback);
	const fontFace = new FontFace(fontName, `url(${fontURL})`);
	fontFace.load().then(fontFace => {
		document.fonts.add(fontFace);
		callback(fontFace);
	}).catch(e=>{
        // console.log(e);
        callback();
    })
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


const defaultMojiPlus = ' \n,-./01234567890:?ABCDEFGHILMNOPRSTUVabcdefghijklmnoprstuvwxyz“”、。「」いかくけげしせただちてでとなのはめもらるわをんアイカグシスゼダネバフマルレー一下不世中了京人今他伍作使來例価侵値僅先入八六其决况出到劳化匹博原参參叫可吃問喜嘗嘘器噪嚴四在型士壱太奇字存实室實市座庵弐当後徒微心情成我战戦戰拾持掃授排換支攷文新日明替最权来東案桌森標模樣歡求決沈浏海瀏版生用界發的監看督石神福秀章端第糊系終繁纪统网者臭螺襲覽览試話誕請议请跡輸轉逃选遇還郎配重野銳键間雨雷電面音頭題页项香驗验體魂鳴麦黙點🏼👩！，'.split('');

const getMoji = _=>{
    let v = defaultMojiPlus+layouts.map(a=>[a.inputs.map(t=>t.placeholder),a.exemples]).flat().join();
    // console.log(v)
    // v += document.querySelector('body').textContent;
    return v;
};

let defaultMoji = Array.from(new Set(getMoji())).sort();

// console.log(defaultMoji.join(''));

// if(ios || !isChrome){
//     defaultMoji = [];
// }

if(debug){
    const unicode = str2utf8(defaultMoji.join('')).join();
    console.log(`${fontAPI}?name=${fontFamilyName}&type=woff&unicode=${unicode}`);
}

const diffDefaultMoji = text=>{
    return text.split('').filter(moji=>!defaultMoji.includes(moji)).join('').replace(/\s/g,'')
};


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
    noise:true,
    outputRatio:1.334,
    // inverse:false,// Math.random()>0.9,
};
const outputRatios = [
    {
        value: 1.334,
        text: '4:3'
    },
    {
        value: 1.778,
        text: '16:9'
    },
    {
        value: 1,
        text: '3:3'
    },
    {
        value: 1.25,
        text: '5:4'
    },
    {
        value: 1.5,
        text: '3:2'
    },
]
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
        text:'黑白'
    },
    {
        value:'wb',
        text:'白黑'
    },
    {
        value:'br',
        text:'黑红'
    },
    {
        value:'rw',
        text:'红白'
    },
    {
        value:'by',
        text:'黑黄'
    },
    // {
    //     value:'yb',
    //     text:'黄黑'
    // }
]
const data ={
    layout:null,
    layouts:[],
    config:deepCopy(defaultConfig),
    texts,
    loading:true,
    lastAllText:'',
    output: null,
    downloadFilename: null,
};
const Layouts = {}
layouts.forEach(layout=>{
    Layouts[layout.id] = layout;
});

const defaultTitle = document.title;


const textOrigin = '扫袭';
const textBefore = '掃襲';

const textFilter = text=>{
    return text;
};





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
                    return textFilter(this.texts[index] || input.placeholder)
                });

                this.loading = true;
                getFontFromText(fontFamilyName,texts.join(''), _=>{
                    make({
                        outputCanvas: this.$refs['canvas'],
                        texts,
                        config: this.config,
                        layout: this.layout
                    });
                    this.loading = false;
                    this.lastAllText = this.allText;
                });
            },200);
        },
        setLayout(_layout,noRoute){
            this.layout = _layout;
            const {inputs,config} = _layout;
            // console.log(Object.assign({},defaultConfig,config))
            this.config = Object.assign({},defaultConfig,config);
            this.setDefaultTexts(_layout);

            const { id } = _layout;

            const title = `${_layout.title} - ${defaultTitle}`;

            document.title = title;

            if(!noRoute) history.replaceState({}, title, `./?layout=${encodeURIComponent(id)}`);
        },
        setExemple(exemple){
            // console.log({exemple})
            exemple.forEach((t,i)=>{
                // this.texts[i]=t
                this.$set(this.texts,i,t);
            });
            this.make();
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
            this.make();
        },
        save(){
            const {canvas} = this.$refs;
            this.output = canvas.toDataURL('image/jpeg',.95);
            this.downloadFilename = `[lab.magiconch.com][福音戰士標題生成器]-${+Date.now()}.jpg`;
        },
        tc(){
            this.texts = this.texts.map(s=>{
                if(s.constructor === String) return transformFunc[2](s);

                return s
            });
            this.make();
        }
    },
    computed:{
        haveMatisse(){
            return haveMatisse
        },
        _text(){
            return this.layout.inputs.map((input,index)=>{
                const {type} = input;
                if(type==='tab'){
                    return this.texts[index];
                }
                return textFilter(this.texts[index] || input.placeholder)
            });
        },
        allText(){
            return this._text.join(',');
        },
        canTc(){
            return this.texts.join() !== transformFunc[2](this.texts.join())
        },
        noMatchMojis(){
            return Array.from(new Set(this.allText)).sort().filter(m=>!EVAMatisseClassicMojis.includes(m))
        }
    },
    watch:{
        config:{
            deep:true,
            handler:'make'
        },
		output(v){
			document.documentElement.setAttribute('data-output',!!v);
		},
        // layout:'make',
        // texts:{
        //     deep:true,
        //     handler:'make'
        // },
    }
})




const getQuerys = _=>{
	const GET = {};
	let queryString = location.search.slice(1);
	if(queryString){
		let gets = queryString.split(/&/g);
		gets.forEach(get=>{
			let [k,v] = get.split(/=/);
			GET[decodeURIComponent(k)] = decodeURIComponent(v);
		})
	};
	return GET
};

let outputCanvas = createCanvas();
let canvas = createCanvas();

const c = async callback=>{
    loadFont('notdef','NotDefault.woff2',async _=>{
        loadFont('baseSplit','base-split.woff?r=220716',async _=>{
            getFontFromText(fontFamilyName,getMoji(),async _=>{
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
                    make({
                        outputCanvas,
                        canvas,
                        texts,
                        config,
                        layout
                    })
                    const src = makeBMPFormCanvas(outputCanvas)
                    layout.src = src;
                    // console.log(src)
                    // app.$set(layout,'src',src)
                    // outputEl.appendChild(el)

                    // if(layout.exemples){
                    //     layout.exemples.forEach(texts=>{
                    //         const el = make({
                    //             texts,
                    //             config,
                    //             layout
                    //         })
                    //         // outputEl.appendChild(el)
                    //     })
                    // }
                })
                app.layouts = layouts;
                callback()
            })
        })
    })
}

c(_=>{
    const GET = getQuerys();
    const layoutId = GET['layout'] || 'e1';
    if(Layouts[layoutId]){
        app.setLayout(Layouts[layoutId],1);
    }

    app.loading = false;
});



