
const outputHeight = 480;
const outputWidth = outputHeight / 3 * 4;

const renderScale = 2;


// const defaultHeight = 960;
const defaultWidth  = outputWidth  * 2;
const defaultHeight = outputHeight * 2;


const padding = defaultHeight / 24;
const space = padding / 2;

const fontSize = defaultHeight / 2;
const defaultFontSize = fontSize;
const kataFontSize = fontSize * 0.85;
const kataFontSizeDiff = fontSize - kataFontSize;

// const whiteColor = '#e8e8e8'
const whiteColor = '#e4e0e8'
const blackColor = '#030201'

let fontFamilyName = 'EVAMatisseClassic'
const engFontFamilyName = `"Times New Roman"`

// fontFamilyName = 'MatisseProEB'
// fontFamilyName = 'RaglanStdUB'

const isEngRegex = /^[a-z\s!?:\.()\[\]\{\}]+$/i;

let startTagsString = '「“(‘（『【《〈';
let endTagsString = '」”)’）』】》〉';

let startTags = startTagsString.split('');
let endTags = endTagsString.split('');


let startTagsReg = new RegExp(`[${startTags.join('|')}]`,'g');
let endTagsReg = new RegExp(`[${endTags.join('|')}]`,'g');

let StartAndEndTagReg = new RegExp(`([${startTags.join('|')}])|([${endTags.join('|')}])`,'g');
let StartAndEndTagTestRegex = new RegExp(`([${startTags.join('|')}])|([${endTags.join('|')}])`);

let startEndTitleTextReg = new RegExp(`^([${startTags.join('|')}])(.+)([${endTags.join('|')}])$`);


const randOne = (arr,i)=>{
    if(i !== undefined)return arr[i];
    return arr[Math.floor(Math.random()*arr.length)]
}
const rand = (a,b)=>{
    return a + (b-a) * Math.random()
}


const rgb2yuv = (r,g,b)=>{
	var y, u, v;

	y = r *  .299000 + g *  .587000 + b *  .114000;
	u = r * -.168736 + g * -.331264 + b *  .500000 + 128;
	v = r *  .500000 + g * -.418688 + b * -.081312 + 128;

	y = Math.floor(y);
	u = Math.floor(u);
	v = Math.floor(v);

	return [y,u,v];
};

const yuv2rgb = (y,u,v)=>{
	var r,g,b;

	r = y + 1.4075 * (v - 128);
	g = y - 0.3455 * (u - 128) - (0.7169 * (v - 128));
	b = y + 1.7790 * (u - 128);

	r = Math.floor(r);
	g = Math.floor(g);
	b = Math.floor(b);

	r = (r < 0) ? 0 : r;
	r = (r > 255) ? 255 : r;

	g = (g < 0) ? 0 : g;
	g = (g > 255) ? 255 : g;

	b = (b < 0) ? 0 : b;
	b = (b > 255) ? 255 : b;

	return [r,g,b];
};


const setCtxConfig = (ctx,config)=>{
    const {
        fontSize = defaultFontSize,
        fillStyle = whiteColor,
        textBaseline = 'middle',
        _fontFamilyName = fontFamilyName
    } = config || {};
    
    ctx.font = `900 ${fontSize}px ${_fontFamilyName},serif`;
    ctx.fillStyle = fillStyle
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
    ctx.textAlign = 'left';
    ctx.textBaseline = textBaseline;


    ctx.shadowColor = 'rgba(255,165,0,.6)';//'orange';
    ctx.shadowBlur = space * 1.5;
}


const makeTextCanvas = (text,letterSpacing = 0)=>{
    text = text.trim()
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    document.body.appendChild(canvas)

    let fontFamilyName = null;

    if(isEngRegex.test(text)){
        fontFamilyName = engFontFamilyName
    }

    canvas.style.letterSpacing = `${letterSpacing}px`


    setCtxConfig(ctx,{
        fontFamilyName
    })

    const metrics = ctx.measureText(text)

    // console.log(text,metrics)
    const width = Math.ceil(metrics.width) - letterSpacing;
    const height = Math.ceil(metrics.fontBoundingBoxDescent + metrics.fontBoundingBoxAscent);

    console.log({text,width,height})
    canvas.width = width;
    canvas.height = height;

    setCtxConfig(ctx,{
        fontFamilyName
    })

    ctx.fillText(
        text,
        0, height/2
    );
    document.body.removeChild(canvas)
    return canvas
    
}
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
    document.body.removeChild(canvas)
    return canvas
    
}
const makeLinesCanvas = (texts,letterSpacing = 0)=>{
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
        allHeight += height + letterSpacing;

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
    canvas.height = allHeight - letterSpacing
    lines.forEach(line=>{
        ctx.drawImage(
            line.image,
            0,line.top,
            line.width,line.height
        )
    })
    return canvas;
}
const makeLinesDiffSizeCanvas = (texts,config)=>{
    const {
        letterSpacing = 0,

    } = config
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    setCtxConfig(ctx,{
        // fontFamilyName:'Helvetica'
    });
    let allWidth = 0;
    let allHeight = 0;
    let lines = texts.map(text=>{
        const _canvas = makeTextCanvas(text)
        const width = _canvas.width;
        const height = _canvas.height;

        // const top = allHeight;
        // allHeight += height + letterSpacing;

        if(width > allWidth){
            allWidth = width;
        }
        return {
            image:_canvas,
            text,
            width,
            height,
        }
    }).map(o=>{
        const scale = o.width / allWidth

        if(scale < 0.99){
            o.width = o.width * 0.7
            o.height = o.height * 0.7
        }

        const top = allHeight;
        allHeight += o.height + letterSpacing;

        o.top = top;
        return o
    });

    canvas.width = allWidth
    canvas.height = allHeight - letterSpacing
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

    if(isEngRegex.test(text)){
        config.fontFamilyName = engFontFamilyName;
    }
    
    setCtxConfig(ctx,config);

    text = text.trim();

    if(/^[a-zA-Z][a-z ]+$/.test(text)){
        const metrics = ctx.measureText(text)
        const width = Math.ceil(metrics.width) - letterSpacing;
        const height = Math.ceil(metrics.fontBoundingBoxDescent + metrics.fontBoundingBoxAscent);

        canvas.width = height
        canvas.height = width
        setCtxConfig(ctx,config);

        ctx.save()
        ctx.translate(height,0)
        ctx.rotate(90 * Math.PI / 180);
        // ctx.translate(-width,-width)

        ctx.fillText(
            text,
            0,0
        );
        ctx.restore()
        return canvas;
    }

    const mojis = text.split('')
    const lineHeight = fontSize + letterSpacing
    const width = fontSize
    const height = mojis.length * lineHeight - letterSpacing

    canvas.width = width
    canvas.height = height

    setCtxConfig(ctx,config);
    ctx.save()
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    mojis.forEach((moji,index)=>{
        ctx.save()
        ctx.translate(width/2, index * lineHeight + fontSize / 2);
        
        if(StartAndEndTagTestRegex.test(moji) || /ー/.test(moji)){
            ctx.rotate(90 * Math.PI / 180);
        }
        ctx.fillText(
            moji,
            0,0
        );
        ctx.restore()
    })
    return canvas

}





const make = text=>{
    console.time(text)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = defaultWidth;
    const height = defaultHeight;
    const scale = width / height;

    canvas.width = width;
    canvas.height = height;

    const ctxConfig = {
        fontColor: whiteColor,
        backgroundColor: blackColor,

    }
    ctx.fillStyle = blackColor;
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

            if(aLength === 2 && bLength === 2){
                if(Math.random() > 0.5){
                    // 第一话 xx、xx
                    const titleCanvas = (_=>{
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const verticalCanvas = makeVerticalTextCanvas(a,-space)
                        const pointCanvas = makeTextCanvas('、')
                        const horizontalCanvas = makeTextCanvas(b,-space)
    
                        const width = Math.ceil( horizontalCanvas.width / bLength * (bLength+0.3) ) + verticalCanvas.width
                        const height = verticalCanvas.height
    
                        canvas.width = width
                        canvas.height = height
    
                        ctx.drawImage(verticalCanvas, 0,0)
                        ctx.drawImage(
                            pointCanvas,
                            verticalCanvas.width - space * 2, height - horizontalCanvas.height
                         )
                        ctx.drawImage(horizontalCanvas, width - horizontalCanvas.width, height - horizontalCanvas.height)
                        return canvas
                    })()
    
                    if(sub){
                        const subCanvas = makeTextCanvas(sub,-space)
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
    
                }else{ //  if(/入/.test(text))
    
                    // 第十三话 xx、侵入
    
                    const titleCanvas = (_=>{
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const aCanvas = makeTextCanvas(a,-space)
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
    
                    const subCanvas = makeTextCanvas(sub,-space)
                    let subHeight = height * 0.19;
                    let subWidth = subHeight / subCanvas.height * subCanvas.width;
                
                    ctx.drawImage(
                        subCanvas,
                        padding,height - padding - subHeight,
                        subWidth,subHeight
                    );
    
                }
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

                    const baCanvas = makeTextCanvas(ba,-space)
                    const bbCanvas = makeVerticalTextCanvas(bb,-space)



                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = baCanvas.width;
                    canvas.height = baCanvas.height + bbCanvas.height;

                    ctx.drawImage(baCanvas, 0,0)
                    ctx.drawImage(bbCanvas, 
                        baCanvas.width - bbCanvas.width,baCanvas.height - space,
                        bbCanvas.width,bbCanvas.height
                    )
                    return canvas;
                })()

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


                const subCanvas = makeTextCanvas(sub,-space)
                let subHeight = height * 0.19;
                let subWidth = subHeight / subCanvas.height * subCanvas.width;
            
                ctx.drawImage(
                    subCanvas,
                    padding,height - padding - subHeight - space * 2,
                    subWidth,subHeight
                );
            }else{
                // 保底方案 暂时用 使徒侵入
                const titleCanvas = (_=>{
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const aCanvas = makeTextCanvas(a,-space)
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
                    return canvas;
                })();

                let titleWidth = width - padding * 2
                let titleHeight = titleWidth / titleCanvas.width * titleCanvas.height;
                titleHeight = Math.min( titleHeight, height - padding * 2 );
                // titleWidth = Math.min(titleWidth,width - padding * 2)
                ctx.drawImage(
                    titleCanvas,
                    padding , padding,
                    titleWidth , titleHeight
                );
            }

        }else if(isEngRegex.test(text)){
            // 英文标题的情况
            //两个空格以上分多行
            if(text.length < 10){
                // [air]
                // 小于十个字符 框框
                // const textCanvas = makeTextSizeDiffCanvas(text,-4);
                const textCanvas = makeTextCanvas(text);
                const config = randOne([
                    {
                        heightScale: 0.2,
                        padding: padding,
                        borderWidth: space * 0.5,
                    },
                    {
                        heightScale: 0.4,
                        padding: padding * 1.5,
                        borderWidth: space
                    },
                    // {
                    //     heightScale: 0.6,
                    //     padding: padding * 2,
                    //     borderWidth: space * 1.5
                    // },
                ]);
                const textHeight = height * config.heightScale;
                const textWidth = Math.min(textHeight * textCanvas.width / textCanvas.height, width * 0.8);

                ctx.drawImage(
                    textCanvas,
                    (width - textWidth) / 2, ( height - textHeight ) / 2,
                    textWidth,textHeight
                );
                ctx.strokeStyle = whiteColor;
                ctx.lineWidth = config.borderWidth;
                const rectWidth  = textWidth + config.padding * 2;
                const rectHeight = textHeight + config.padding;

                const rectLeft = (width - rectWidth) / 2;
                const rectTop = (height - rectHeight) / 2;
                ctx.strokeRect(
                    rectLeft, rectTop,
                    rectWidth, rectHeight
                );

            }else{
                const textCanvas = makeTextSizeDiffCanvas(text,-4)
                const textWidth = width * 0.8;
                const textHeight = Math.min(textWidth / textCanvas.width * textCanvas.height * 1.8, height * 0.8);
    
    
                if(sub){
                    let subCanvas = makeTextCanvas(sub,-space)
                    let subHeight = height * 0.1;
                    let subWidth = subHeight / subCanvas.height * subCanvas.width * 0.6;
                
                    ctx.drawImage(
                        subCanvas,
                        (width - subWidth) / 2, height * 0.3,
                        subWidth,subHeight
                    );
                    ctx.drawImage(
                        textCanvas,
                        width * 0.1,height * 0.42,
                        textWidth, textHeight
                    )
                }else{
                    ctx.drawImage(
                        textCanvas,
                        width * 0.1, height * 0.1,
                        textWidth, textHeight
                    )
                }
            }
        }else if(startEndTitleTextReg.test(text)){
            // 书名号包裹的情况
            let titleCanvas;
            if(0.5 > Math.random()){
                titleCanvas = makeTextCanvas(text,-space)
            }else{
                titleCanvas = makeVerticalTextCanvas(text,-space)
            }
            
            let titleWidth;
            let titleHeight;
            let titleTop = padding;
            let titleLeft = padding;
            let titleScale = titleCanvas.width / titleCanvas.height;

            if(titleScale > scale){
                titleWidth = width - padding * 2;
                titleHeight = titleWidth / titleScale * rand(1,1.6)
                titleTop = (height - titleHeight) / 2
            }else{
                titleHeight = height - padding * 2;
                titleWidth = titleHeight * titleScale * rand(1,1.6)
                titleLeft = (width - titleWidth) / 2;
            }

            ctx.drawImage(
                titleCanvas,
                titleLeft , titleTop,
                titleWidth, titleHeight
            )

        }else if(text.length > 10){
            // 大于十个字符 六字多排 世界中心呼唤
            const texts = new Array(Math.ceil(text.length/6)).fill(1).map((_,index)=>{
                const start = index * 6;
                const end = start + 6;
                return text.slice(start,end)
            })
            const canvas = makeLinesCanvas(texts,-space * 1.5);
            ctx.drawImage(
                canvas,
                width * 0.12,height * 0.25,
                width * 0.76,height * 0.67
            )

            if(sub){
                const subCanvas = makeTextCanvas(sub,-space)
                let subHeight = height * 0.15;
                let subWidth = subHeight / subCanvas.height * subCanvas.width * 0.8;
            
                ctx.drawImage(
                    subCanvas,
                    (width - subWidth) / 2 - space, height * 0.1,
                    subWidth,subHeight
                );
            }
        }else{
            // 单排 小于 十个字
            // 单行大标题
            randOne([
                _=>{
                    // 标题在上
                    const textCanvas = makeTextSizeDiffCanvas(text,-space * 2)
                    const textWidth = width - padding * 2
                    const textHeight = Math.min(textWidth / textCanvas.width * textCanvas.height,height - padding * 2)
                    ctx.drawImage(
                        textCanvas,
                        padding, padding * 2,
                        textWidth, textHeight
                    )
                    
                    if(sub){
                        let subCanvas = makeTextCanvas(sub,-space)
                        let subHeight = height * 0.2;
                        let subWidth = subHeight / subCanvas.height * subCanvas.width * 0.8;
                        let subLeft = randOne([
                            padding, // left
                            (width - subWidth) / 2, //center
                            width - subWidth - padding // right
                        ]);
    
                        ctx.drawImage(
                            subCanvas,
                            subLeft, height - subHeight - padding * 2,
                            subWidth,subHeight
                        );
                    }
                },
                _=>{
                    // 标题在下
                    const textCanvas = makeTextSizeDiffCanvas(text,-space * 2)
                    const textWidth = width - padding * 2
                    const textHeight = Math.min(textWidth / textCanvas.width * textCanvas.height,height - padding * 2)
                    ctx.drawImage(
                        textCanvas,
                        padding, height - padding * 2 - textHeight,
                        textWidth, textHeight
                    )
                    
                    if(sub){
                        let subCanvas = makeTextCanvas(sub,-space)
                        let subHeight = height * 0.2;
                        let subWidth = subHeight / subCanvas.height * subCanvas.width * 0.8;
                        let subLeft = randOne([
                            padding, // left
                            (width - subWidth) / 2, //center
                            width - subWidth - padding // right
                        ]);
    
                        ctx.drawImage(
                            subCanvas,
                            subLeft, padding * 2,
                            subWidth,subHeight
                        );
                    }
                },
                _=>{
                    // 标题在中
                    const textCanvas = makeTextSizeDiffCanvas(text,-space * 2)
                    ctx.drawImage(
                        textCanvas,
                        width * 0.2,height * 0.45,
                        width * 0.6,height/4
                    )
                    
                    if(sub){
                        let subCanvas = makeTextCanvas(sub,-space)
                        let subHeight = height * 0.12;
                        let subWidth = subHeight / subCanvas.height * subCanvas.width * 0.8;
                    
                        ctx.drawImage(
                            subCanvas,
                            (width - subWidth) / 2, height * 0.25,
                            subWidth,subHeight
                        );
                    }
                },
                _=>{
                    // 标题在左 sub在右
                    const textCanvas = makeVerticalTextCanvas(text,-space * 2)
                    const textHeight = height - padding * 2
                    const textWidth = Math.min(textHeight / textCanvas.height * textCanvas.width, width - padding * 2) * rand(0.8,1.4)
                    
                    ctx.drawImage(
                        textCanvas,
                        padding, padding,
                        textWidth, textHeight
                    )
                    
                    if(sub){
                        let subCanvas = makeTextCanvas(sub,-space)
                        let subHeight = height * 0.12;
                        let subWidth = Math.min(
                            subHeight / subCanvas.height * subCanvas.width * 0.8,
                            width - textWidth - padding * 2
                        );
                        const subLeft = width - padding - subWidth;

                        const subTop = randOne([
                            padding,
                            (height - subHeight) / 2, // middle
                            height - subHeight - padding
                        ]);
                        ctx.drawImage(
                            subCanvas,
                            subLeft, subTop,
                            subWidth,subHeight
                        );
                    }
                },
                _=>{
                    // 标题在右 sub在左
                    const textCanvas = makeVerticalTextCanvas(text,-space * 2)
                    const textHeight = height - padding * 2
                    const textWidth = Math.min(textHeight / textCanvas.height * textCanvas.width, width - padding * 2) * rand(0.8,1.4)
                    
                    ctx.drawImage(
                        textCanvas,
                        width - padding - textWidth, padding,
                        textWidth, textHeight
                    )
                    
                    if(sub){
                        let subCanvas = makeTextCanvas(sub,-space)
                        let subHeight = height * 0.12;
                        let subWidth = Math.min(
                            subHeight / subCanvas.height * subCanvas.width * 0.8,
                            width - textWidth - padding * 2
                        );
                        const subLeft = padding;

                        const subTop = randOne([
                            padding,
                            (height - subHeight) / 2, // middle
                            height - subHeight - padding
                        ]);
                        ctx.drawImage(
                            subCanvas,
                            subLeft, subTop,
                            subWidth,subHeight
                        );
                    }
                },
            ])()
        }
    }else if(texts.length === 2){
        let [a,b] = texts.map(a=>a.trim()).sort((a,b)=>b.length-a.length)

        console.log({a,b})
        const engTitle = /^.+? .+? .+?/i;

        if(engTitle.test(a)){

            const subCanvas = makeTextCanvas(b,-space)
            let subHeight = height * 0.2;
            let subWidth = subHeight / subCanvas.height * subCanvas.width;
        
            ctx.drawImage(
                subCanvas,
                padding,height - padding - subHeight,
                subWidth,subHeight
            );


            const engs = a.split(/\s+/g);
            const titleCanvas = makeLinesDiffSizeCanvas(engs,{letterSpacing:-space})
            
            let titleWidth = width - padding * 2
            let titleHeight = titleWidth / titleCanvas.width * titleCanvas.height * 1.2;
            let maxTitleHeight = height - padding * 2 - subHeight
            titleHeight = Math.min(titleHeight,maxTitleHeight)
            // titleWidth = Math.min(titleWidth,width - padding * 2)
            ctx.drawImage(
                titleCanvas,
                padding , padding,
                titleWidth , titleHeight
            );
    
    
        }else{
            randOne([
                _=>{
                    // ┗
                    const titleCanvas = (_=>{
                        
                        const aSliceIndex = Math.floor(a.length/2)
                        const aa = a.slice(0,aSliceIndex)
                        const ab = a.slice(aSliceIndex)


                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const verticalCanvas = makeVerticalTextCanvas(aa,-space)
                        const horizontalCanvas = makeTextCanvas(ab,-space)
    
                        const width = horizontalCanvas.width + verticalCanvas.width - space
                        const height = verticalCanvas.height
    
                        canvas.width = width
                        canvas.height = height
    
                        ctx.drawImage(verticalCanvas, 0,0)
                        ctx.drawImage(horizontalCanvas, width - horizontalCanvas.width - space, height - horizontalCanvas.height)
                        return canvas
                    })();

                    const subCanvas = makeTextCanvas(b,-space)
                    let subHeight = height * 0.2;
                    let subWidth = Math.min(subHeight / subCanvas.height * subCanvas.width,width - padding * 2);
                
                    ctx.drawImage(
                        subCanvas,
                        width - subWidth - padding,padding,
                        subWidth,subHeight
                    );

                    let titleHeight = height - padding * 2 - subHeight
                    let titleWidth = Math.min(titleHeight / titleCanvas.height * titleCanvas.width, width - padding * 2)
                    ctx.drawImage(
                        titleCanvas,
                        padding , height - titleHeight - padding,
                        titleWidth , titleHeight
                    )
                },
                _=>{
                    // ┒
                    const titleCanvas = (_=>{
                        
                        const aSliceIndex = Math.ceil(a.length/2)
                        const aa = a.slice(0,aSliceIndex)
                        const ab = a.slice(aSliceIndex)


                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const aaCanvas = makeTextCanvas(aa,-space)
                        const abCanvas = makeVerticalTextCanvas(ab,-space)
    
                        const width = aaCanvas.width + abCanvas.width - space
                        const height = abCanvas.height
    
                        canvas.width = width
                        canvas.height = height
    
                        ctx.drawImage(aaCanvas, 0,0)
                        ctx.drawImage(abCanvas, aaCanvas.width - space, 0)
                        return canvas
                    })();

                    const subCanvas = makeVerticalTextCanvas(b,-space)
                    let subWidth = width * 0.15;
                    let subHeight = Math.min(subWidth * subCanvas.height / subCanvas.width * 1.1,height - padding * 2);
                
                    ctx.drawImage(
                        subCanvas,
                        padding,padding,
                        subWidth,subHeight
                    );

                    let titleWidth = width - padding * 2 - subWidth * 1.2
                    let titleHeight = titleWidth / titleCanvas.width * titleCanvas.height
                    ctx.drawImage(
                        titleCanvas,
                        width - titleWidth - padding , height - titleHeight - padding,
                        titleWidth , titleHeight
                    )
                },
            ])()
        }
    }else{
        // 多排托底
        console.log(/多排托底/,texts);
        if(texts.length){
            const aCanvas = makeLinesCanvas(texts,-space)

            ctx.drawImage(
                aCanvas,
                width * 0.1, height * 0.1,
                width * 0.8, height * 0.8,
            )
        }


        // const _height = Math.floor(height/texts.length)
        // texts.forEach((item,index)=>{
        //     const text = item.trim();

        //     const textCanvas = makeTextCanvas(text,-space)
        //     ctx.drawImage(textCanvas,0,index * _height,width,_height)
        // })
    }

    // StackBlur.canvasRGBA(canvas, 0, 0, width, height, 1);

    const zoom = 2;
    if(zoom !== 1){
        const zoomWidth = width / zoom;
        const zoomheight = height / zoom;
    
        ctx.drawImage(
            canvas,
            0,0,width,height,
            0,0,zoomWidth,zoomheight,
        )
        ctx.drawImage(
            canvas,
            0,0,zoomWidth,zoomheight,
            0,0,width,height
        )
    }

    const blur = 3;

    const blurFunc = _=>{
        ctx.drawImage(
            canvas,
            0,0,width,height,
            0.5,0.5,width,height
        )
        ctx.drawImage(
            canvas,
            0,0,width,height,
            -0.5,-0.5,width,height
        )
    }
    if(blur){
        let i = blur;
        while(i--){
            blurFunc();
        }
    }

    const outLine = false;
    
    if(outLine){
        const outLineCanvas = document.createElement('canvas');
        const outLineCtx = outLineCanvas.getContext('2d');
        
        const outLineZoom = 4;
        const outLineWidth = width / outLineZoom;
        const outLineheight = height / outLineZoom;
    
        outLineCanvas.width = outLineWidth
        outLineCanvas.height = outLineheight
    
        outLineCtx.drawImage(
            canvas,
            0,0,width,height,
            0,0,outLineWidth,outLineheight
        );
        ctx.globalAlpha = 0.3;
        ctx.drawImage(
            outLineCanvas,
            0,0,outLineWidth,outLineheight,
            0,0,width,height,
        );
    }


    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d');

    outputCanvas.width = outputWidth
    outputCanvas.height = outputHeight

    outputCtx.drawImage(
        canvas,
        0,0,width,height,
        0,0,outputWidth,outputHeight,
    )
    



	let pixel = outputCtx.getImageData(0,0,outputWidth,outputHeight);
	// let pixelData = pixel.data;

    // for(let i = 0;i < pixelData.length;i += 4){
    //     let yuv = rgb2yuv(
    //         pixelData[i  ],
    //         pixelData[i+1],
    //         pixelData[i+2],
    //     );
    //     // UV 漂移
    //     yuv = UVshifting(yuv,config);

    //     pixelData[i                 ] = yuv[0];
    //     pixelData[i+1 - shiftUPixel ] = yuv[1];
    //     pixelData[i+2 - shiftVPixel ] = yuv[2];
    // }

    pixel = convolute(
        pixel,
        [
            0, -0.3,  0,
            -0.3, 1.3,  0.7,
            0, -0.3,  0
        ],
        outputCtx
    );

    blurFunc();
    // pixelData = pixel.data;

	// for(let i = 0;i < pixelData.length;i += 4){

	// 	let _rgb = yuv2rgb(
	// 		pixelData[i],
	// 		pixelData[i+1],
	// 		pixelData[i+2],
	// 	);

	// 	pixelData[i   ] = _rgb[0];
	// 	pixelData[i+1 ] = _rgb[1];
	// 	pixelData[i+2 ] = _rgb[2];
	// }

	outputCtx.putImageData(pixel,0,0);

    console.timeEnd (text)
    return outputCanvas
}




const convolute = (pixels,weights,ctx)=>{
	const side = Math.round(Math.sqrt(weights.length));
	const halfSide = Math.floor(side/2);

	const src = pixels.data;
	const sw = pixels.width;
	const sh = pixels.height;

	const w = sw;
	const h = sh;
	const output = ctx.createImageData(w, h);
	const dst = output.data;


	for (let y=0; y<h; y++) {
		for (let x=0; x<w; x++) {
			const sy = y;
			const sx = x;
			const dstOff = (y*w+x)*4;
			let r=0, g=0, b=0;
			for (let cy=0; cy<side; cy++) {
				for (let cx=0; cx<side; cx++) {
					const scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
					const scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
					const srcOff = (scy*sw+scx)*4;
					const wt = weights[cy*side+cx];
					r += src[srcOff  ] * wt;
					g += src[srcOff+1] * wt;
					b += src[srcOff+2] * wt;
				}
			}
			dst[dstOff  ] = r;
			dst[dstOff+1] = g;
			dst[dstOff+2] = b;
			dst[dstOff+3] = 255;
		}
	}


	// for (let y=0; y<h; y++) {
	// 	for (let x=0; x<w; x++) {
	// 		const srcOff = (y*w+x)*4;
	// 		src[srcOff] = dst[srcOff];
	// 	}
	// }
	return output;
};
