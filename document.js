
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

const fontSize = 480;
const defaultWidth = 1280;
const defaultHeight = 960;
const padding = 40;


const setCtxConfig = (ctx,config)=>{
    const {fontSize=480,fillStyle='#FFF',textBaseline='middle'} = config || {};
    ctx.font = `900 ${fontSize}px EVAMatisseClassic,serif`;
    ctx.fillStyle = fillStyle
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
    ctx.textAlign = 'left';
    ctx.textBaseline = textBaseline
}
const makeTextCanvas = (text,letterSpacing = 0)=>{
    text = text.trim()
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    document.body.appendChild(canvas)

    canvas.style.letterSpacing = `${letterSpacing}px`


    setCtxConfig(ctx)

    const metrics = ctx.measureText(text)

    console.log(text,metrics)
    const width = Math.ceil(metrics.width) - letterSpacing;
    const height = metrics.fontBoundingBoxDescent + metrics.fontBoundingBoxAscent;

    canvas.width = width;
    canvas.height = height;

    setCtxConfig(ctx)

    ctx.fillText(
        text,
        0, height/2
    );
        document.body.appendChild(canvas)
    return canvas
    
}
const kataFontSize = fontSize * 0.85;
const kataFontSizeDiff = fontSize - kataFontSize;
const makeTextSizeDiffCanvas = (text,letterSpacing = 0)=>{
    text = text.trim()

    const kataRegex = text.match(/[ァ-ヶぁ-ん]/g)
    if(!kataRegex) return makeTextCanvas(text,letterSpacing)
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    document.body.appendChild(canvas)

    canvas.style.letterSpacing = `${letterSpacing}px`

    const mojis = text.split('')

    const fontWidth = fontSize + letterSpacing
    const width = mojis.length * fontWidth - letterSpacing - kataFontSizeDiff * kataRegex.length
    const height = fontSize

    canvas.width = width
    canvas.height = height


    let left = 0;

    mojis.forEach((moji,index)=>{
        const isKata = /[ァ-ヶぁ-ん]/.test(moji);
        const _fontSize = isKata?kataFontSize:fontSize;

        setCtxConfig(ctx,{
            textBaseline:'bottom',
            fontSize: _fontSize
        });

        ctx.fillText(
            moji,
            left, height
        );
        left += _fontSize + letterSpacing;
    })
    return canvas
    
}
const makeLinesCanvas = (texts,lineHeight)=>{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    setCtxConfig(ctx);
    let allWidth = 0;
    let allHeight = 0;
    const lines = texts.map(text=>{

        const _canvas = makeTextCanvas(text)
        const width = _canvas.width;
        const height = _canvas.height;

        const top = allHeight;
        allHeight += height + lineHeight;

        if(width > allWidth){
            allWidth = width;
        }
        return {
            image:_canvas,
            text,
            width,
            height,
            top
        }
    });
    canvas.width = allWidth
    canvas.height = allHeight - lineHeight
    lines.forEach(line=>{
        ctx.drawImage(
            line.image,
            0,line.top,
            line.width,line.height
        )
    })
    return canvas;
}



const makeVerticalTextCanvas = (text,letterSpacing = 0)=>{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const config = {
        textBaseline:'top',
    };
    
    setCtxConfig(ctx,config);

    text = text.trim();

    const mojis = text.split('')

    const lineHeight = fontSize + letterSpacing
    const width = fontSize
    const height = mojis.length * lineHeight - letterSpacing

    canvas.width = width
    canvas.height = height

    setCtxConfig(ctx,config);

    mojis.forEach((moji,index)=>{
        ctx.fillText(
            moji,
            0, index * lineHeight
        );
    })
    return canvas

}

const make = text=>{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = 1280;
    const height = 960;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,width,height);


    text = text.trim()

    let texts = text.split(/\n+/g).filter(a=>a);

    let sub;
    texts = texts.map(text=>{
        if(/^第|^EPISODE|回$|話$|话$/i.test(text)){
            sub = text.trim();
            return null;
        }

        return text
    }).filter(t=>t);


    // texts = texts.map(text=>{
    //     if(/、/.test(text)){
    //         return text
    //     }

    //     // 英文字符 单排
    //     if(/^[a-z\s!?:]+$/i.test(text)){
    //         return text
    //     }
        
    //     // 大于十个字符 六字多排
    //     if(text.length > 10){
    //         return new Array(Math.ceil(text.length/6)).fill(1).map((_,index)=>{
    //             const start = index * 6;
    //             const end = start + 6;
    //             return text.slice(start,end)
    //         })
    //     }

    //     return text
    // })

    const textsLength = texts.length;

    if(textsLength === 1){
        // 一排标题的情况
        const text = texts[0]


        if(/.、./.test(text)){

            let [a,b] = text.split(/、/);
            a = a.trim();
            b = b.trim();
            const aLength = a.length;
            const bLength = b.length;


            if(/来/.test(text)){
                // 第一话 xx、xx
                const titleCanvas = (_=>{
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const verticalCanvas = makeVerticalTextCanvas(a,-20)
                    const pointCanvas = makeTextCanvas('、')
                    const horizontalCanvas = makeTextCanvas(b,-20)

                    const width = Math.ceil( horizontalCanvas.width / bLength * (bLength+0.3) ) + verticalCanvas.width
                    const height = verticalCanvas.height

                    canvas.width = width
                    canvas.height = height

                    ctx.drawImage(verticalCanvas, 0,0)
                    ctx.drawImage(
                        pointCanvas,
                        verticalCanvas.width - 40, height - horizontalCanvas.height
                     )
                    ctx.drawImage(horizontalCanvas, width - horizontalCanvas.width, height - horizontalCanvas.height)
                    return canvas
                })()

                if(sub){
                    const subCanvas = makeTextCanvas(sub,-20)
                    let subHeight = height * 0.19;
                    let subWidth = subHeight / subCanvas.height * subCanvas.width;
                
                    ctx.drawImage(
                        subCanvas,
                        padding,padding,
                        subWidth,subHeight
                    );
                    let titleHeight = height - padding * 2 - subHeight
                    let titleWidth = titleHeight / titleCanvas.height * titleCanvas.width
                    ctx.drawImage(
                        titleCanvas,
                        padding , padding + subHeight,
                        titleWidth , titleHeight
                    )
                }else{

                    let titleHeight = height - padding * 2
                    let titleWidth = titleHeight / titleCanvas.height * titleCanvas.width
                    titleWidth = Math.min(titleWidth,width - padding * 2)
                    ctx.drawImage(
                        titleCanvas,
                        padding , (height - titleHeight) / 2,
                        titleWidth , titleHeight
                    )
                }

            }else if(/入/.test(text)){

                // 第十三话 xx、侵入

                const titleCanvas = (_=>{
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const aCanvas = makeTextCanvas(a,-20)
                    const pointCanvas = makeTextCanvas('、')
                    const bCanvas = makeVerticalTextCanvas(b)
                    
                    const width = Math.ceil( aCanvas.width / bLength * (bLength+0.2) ) + bCanvas.width
                    const height = bCanvas.height

                    canvas.width = width
                    canvas.height = height

                    ctx.drawImage(aCanvas, 0,0)
                    ctx.drawImage(
                        pointCanvas, 
                        aCanvas.width - fontSize * 0.05 , 0 ,
                        pointCanvas.width * 0.8,pointCanvas.height * 1.14
                    )
                    ctx.drawImage(bCanvas, width - bCanvas.width, 0)
                    return canvas
                })();

                let titleWidth = width - padding * 2
                let titleHeight = titleWidth / titleCanvas.width * titleCanvas.height;
                let maxTitleHeight = height - padding * 2
                titleHeight = Math.min(titleHeight,maxTitleHeight)
                // titleWidth = Math.min(titleWidth,width - padding * 2)
                ctx.drawImage(
                    titleCanvas,
                    padding , padding,
                    titleWidth , titleHeight
                );

                const subCanvas = makeTextCanvas(sub,-20)
                let subHeight = height * 0.19;
                let subWidth = subHeight / subCanvas.height * subCanvas.width;
            
                ctx.drawImage(
                    subCanvas,
                    padding,height - padding - subHeight,
                    subWidth,subHeight
                );

            }else if(aLength < 3 && bLength > 4){
                // 雨

                const aCanvas = makeTextCanvas(a)
                const pointCanvas = makeTextCanvas('、')

                const bCanvas = (_=>{
                    // b字符需要拐个弯
                    const bSliceIndex = Math.floor(bLength/2)
                    const ba = b.slice(0,bSliceIndex)
                    const bb = b.slice(bSliceIndex)
                    console.log({ba,bb})

                    const baCanvas = makeTextCanvas(ba,-20)
                    const bbCanvas = makeVerticalTextCanvas(bb,-20)



                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = baCanvas.width;
                    canvas.height = baCanvas.height + bbCanvas.height;

                    ctx.drawImage(baCanvas, 0,0)
                    ctx.drawImage(bbCanvas, 
                        baCanvas.width - bbCanvas.width,baCanvas.height - 20,
                        bbCanvas.width,bbCanvas.height
                    )
                    return canvas;
                })()
                const width = defaultWidth
                const height = defaultHeight

                canvas.width = width
                canvas.height = height

                ctx.drawImage(aCanvas, 
                    padding, padding,
                    width * 0.35, width * 0.35,
                )

                ctx.drawImage(
                    pointCanvas, 
                    padding + width * 0.31 , padding ,
                    width * 0.24, width * 0.35,
                )
                let bWidth = width * 0.5 - padding
                let bHeight = bWidth / bCanvas.width * bCanvas.height

                ctx.drawImage(bCanvas, 
                    width * 0.5, padding,
                    bWidth, bHeight
                )


                const subCanvas = makeTextCanvas(sub,-20)
                let subHeight = height * 0.19;
                let subWidth = subHeight / subCanvas.height * subCanvas.width;
            
                ctx.drawImage(
                    subCanvas,
                    padding,height - padding - subHeight - 40,
                    subWidth,subHeight
                );
            }else{
                // 保底方案 暂时用 使徒侵入
                const aCanvas = makeTextCanvas(a,-20)
                const pointCanvas = makeTextCanvas('、')
                const bCanvas = makeVerticalTextCanvas(b)
                
                const width = Math.ceil( aCanvas.width / bLength * (bLength+0.2) ) + bCanvas.width
                const height = bCanvas.height

                canvas.width = width
                canvas.height = height

                ctx.drawImage(aCanvas, 0,0)
                ctx.drawImage(
                    pointCanvas, 
                    aCanvas.width - fontSize * 0.05 , 0 ,
                    pointCanvas.width * 0.8,pointCanvas.height * 1.14
                )
                ctx.drawImage(bCanvas, width - bCanvas.width, 0)
            }

        }else if(/^[a-z\s!?:]+$/i.test(text)){
            // 英文标题的情况
            //两个空格以上分多行

            const textCanvas = makeTextSizeDiffCanvas(text,-20)
            const textWidth = width * 0.8;
            const textHeight = textWidth / textCanvas.width * textCanvas.height * 1.8;

            ctx.drawImage(
                textCanvas,
                width * 0.1,height * 0.45,
                textWidth, textHeight
            )

            let subCanvas = makeTextCanvas(sub,-20)
            let subHeight = height * 0.1;
            let subWidth = subHeight / subCanvas.height * subCanvas.width * 0.6;
        
            ctx.drawImage(
                subCanvas,
                (width - subWidth) / 2, height * 0.34,
                subWidth,subHeight
            );
        }else if(text.length > 10){
            // 大于十个字符 六字多排 世界中心呼唤
            const texts = new Array(Math.ceil(text.length/6)).fill(1).map((_,index)=>{
                const start = index * 6;
                const end = start + 6;
                return text.slice(start,end)
            })
            const canvas = makeLinesCanvas(texts,-30);
            ctx.drawImage(
                canvas,
                width * 0.12,height * 0.25,
                width * 0.76,height * 0.67
            )


            const subCanvas = makeTextCanvas(sub,-20)
            let subHeight = height * 0.15;
            let subWidth = subHeight / subCanvas.height * subCanvas.width * 0.8;
        
            ctx.drawImage(
                subCanvas,
                (width - subWidth) / 2 - 20, 100,
                subWidth,subHeight
            );
        }else{
            // 单排 小于 十个字
            // 单行大标题

            const textCanvas = makeTextSizeDiffCanvas(text,-40)
            ctx.drawImage(
                textCanvas,
                width * 0.2,height * 0.45,
                width * 0.6,height/4
            )
            let subCanvas = makeTextCanvas(sub,-20)
            let subHeight = height * 0.12;
            let subWidth = subHeight / subCanvas.height * subCanvas.width * 0.8;
        
            ctx.drawImage(
                subCanvas,
                (width - subWidth) / 2, height * 0.25,
                subWidth,subHeight
            );
        }
    }else{
        // 多排托底
        console.log(/多排托底/,texts);
        const _height = Math.floor(height/texts.length)
        texts.forEach((item,index)=>{
            const text = item;
            const textCanvas = makeTextCanvas(text,-20)
            ctx.drawImage(textCanvas,0,index * _height,width,_height)
        })
    }

    return canvas
}

const inputEl = document.querySelector('textarea');
const checkboxEl = document.querySelector('input');
const outputEl = document.querySelector('div');

const s = '沉值'
const t = '沈値'
const c = _=>{
    let v = inputEl.value.trim()
    if(checkboxEl.checked) v = transformFunc[2](v)

    getFontFromText('EVAMatisseClassic',v,async _=>{
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
c();

