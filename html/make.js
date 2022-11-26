

const ios = /iphone|ipad|ipod|ios/i.test(navigator.userAgent);
const isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
  navigator.userAgent &&
  navigator.userAgent.indexOf('CriOS') == -1 &&
  navigator.userAgent.indexOf('FxiOS') == -1;
const isMobile = document.body.offsetWidth < 700;
// const whiteColor = '#e8e8e8'
const whiteColor = '#e4e0e8'
const blackColor = '#030201'
const orangeColor = 'rgba(255,165,0,.6)'
const orangeColorInverse = 'rgba(255,165,255,.2)'

let fontWeight = 900;

let fontFamilyName = 'EVAMatisseClassic'
const engFontFamilyName = `"Times New Roman"`

let baseFontFamilyName = 'EVA_Matisse_Classic-EB,MatissePro-EB,baseSplit,notdef,SourceHanSerifCN-Heavy,serif';


const defaultOutputRatio = 1.334;

if(ios){
    fontWeight = 500;
}
// if(ios){
//     fontFamilyName = 'SourceHanSerifHeavy';
// }
// fontFamilyName = 'SourceHanSerifHeavy';

// if(ios || !isChrome){
//     fontFamilyName = 'MatisseProEB'
// }
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
const canvasBoxEl = document.createElement('div');
canvasBoxEl.className = 'canvas-box';
document.body.appendChild(canvasBoxEl);

const createCanvas = _=>{
    const canvas = document.createElement('canvas');
    canvasBoxEl.appendChild(canvas);
    return canvas;
}

const removeCanvas = canvas=>{
    if(canvas.parentNode !== canvasBoxEl) return;
    canvasBoxEl.removeChild(canvas);
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
const measureText = (ctx,text,fontSize)=>{
    const metrics = ctx.measureText(text);

    const width = Math.ceil(metrics.width);
    const height = (metrics.fontBoundingBoxDescent + metrics.fontBoundingBoxAscent) || fontSize;
    // || (metrics.actualBoundingBoxDescent + metrics.actualBoundingBoxAscent )

    // console.log(metrics)
    return {
        metrics,
        width,
        height
    }
}


const zoomCanvas = createCanvas();

const make = ({
    outputCanvas = createCanvas(),
    canvas = createCanvas(),
    texts,
    config = {},
    timer = false,
    layout
})=>{
    if(timer) console.time(layout.title)

    const ctx = canvas.getContext('2d');

    let { 
        shadow = true,
        type95 = false,
        convolute = false,
        noise = false,
        plan,
        outputRatio = 1.334,
    } = config;

    // if(ios) shadow = false;


    const insetHeight = config.height || 480;
    const insetWidth = Math.floor(insetHeight * defaultOutputRatio);

    let renderScale = 2;

    if(type95){
        renderScale = 1;
        convolute = true;
    }

    // const defaultHeight = 960;
    const defaultWidth  = insetWidth  * renderScale;
    const defaultHeight = insetHeight * renderScale;


    const padding = defaultHeight / 24;
    const space = padding / 2;

    const fontSize = defaultHeight / 2;
    const fontPadding = fontSize / 48;
    // console.log({fontPadding})
    const defaultFontSize = fontSize;
    const kataFontSize = Math.floor(fontSize * 0.85);
    const kataFontSizeDiff = fontSize - kataFontSize;

    
    let width  = defaultWidth;
    let height = defaultHeight;

    const scale = width / height;

    
    // config.width  = width;
    // config.height = height;
    // config.scale  = scale;

    canvas.width  = width;
    canvas.height = height;

    let fontColor = whiteColor
    let backgroundColor = blackColor
    let shadowColor = orangeColor

    switch(plan){
        case 'wb':
            fontColor = blackColor
            backgroundColor = whiteColor
            shadowColor = orangeColorInverse
            break;
        case 'br':
            fontColor = '#D00'
            backgroundColor = '#180000'
            shadowColor = 'rgba(255,0,0,.5)'
            break;
        case 'rw':
            fontColor = whiteColor
            backgroundColor = '#910b0b'
            shadowColor = 'rgba(255,120,120,.7)'
            break;
        case 'by':
            fontColor = '#e77225'
            backgroundColor = '#140202'
            shadowColor = 'rgba(231,120,0,.5)'
            break;
        case 'yb':
            fontColor = '#140202'
            backgroundColor = '#e77205'
            shadowColor = 'rgba(231,120,0,.5)'
            break;
    }
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(
        0, 0,
        width, height
    );


    const setCtxConfig = (ctx,config = {})=>{
        const {
            fontSize = defaultFontSize,
            textBaseline = 'middle',
            _fontFamilyName = fontFamilyName,
            // shadow = true
        } = config;

        // console.log({ctx})
        
        ctx.font = `${fontWeight} ${fontSize}px ${_fontFamilyName},${baseFontFamilyName}`;
        ctx.fillStyle = fontColor
        ctx.lineCap  = 'round';
        ctx.lineJoin = 'round';
        ctx.textAlign = 'left';
        ctx.textBaseline = textBaseline;

        if(shadow){
            ctx.shadowColor = shadowColor;//'orange';
            ctx.shadowBlur = space * 2;
        }
    }


    const makeTextCanvas = (text,letterSpacing = 0,margin = 0)=>{
        const canvas = createCanvas();
        const ctx = canvas.getContext('2d');

        let fontFamilyName = null;

        if(isEngRegex.test(text)){
            fontFamilyName = engFontFamilyName
        }

        canvas.style.letterSpacing = `${letterSpacing}px`


        setCtxConfig(ctx,{
            fontFamilyName
        })

        let { width , height } = measureText(ctx,text,fontSize);

        width = width - letterSpacing + fontPadding * 2;
        height = height + fontPadding * 2;

        canvas.width = width;
        canvas.height = height;

        setCtxConfig(ctx,{
            fontFamilyName
        })

        ctx.fillText(
            text,
            fontPadding, height/2
        );
        removeCanvas(canvas)
        return canvas
        
    }
    const pointWidthScale = 0.4;
    const makeTextSizeDiffCanvas = (text,letterSpacing = 0,firstWord = 1)=>{
        let kataRegex = /[ァ-ヶぁ-ん、]/g;
        let kataMatch = text.match(kataRegex);
        if(!kataMatch) return makeTextCanvas(text,letterSpacing)

        // console.log(text,kataMatch.length , text.length)
        if( (kataMatch.length / text.length) > 0.5 ){
            kataRegex = /[のい的、]/g;
            kataMatch = text.match(kataRegex)
            // console.log(text,kataMatch.length , text.length)
            if(!kataMatch) return makeTextCanvas(text,letterSpacing)
        }
        
        const canvas = createCanvas();
        const ctx = canvas.getContext('2d');

        canvas.style.letterSpacing = `${letterSpacing}px`

        const mojis = text.split('')


        let allWidth = fontPadding * 2 - letterSpacing;
        mojis.forEach(moji=>{

            let mojiFontSize = fontSize;

            if(/、/.test(moji)){
                mojiFontSize = fontSize * pointWidthScale
            }else if(new RegExp(kataRegex,'').test(moji)){
                mojiFontSize = kataFontSize;
            }
            

            allWidth += mojiFontSize + letterSpacing;
        })
        
        const width = allWidth;
        const height = fontSize + fontPadding * 2;

        canvas.width = width
        canvas.height = height


        let left = fontPadding;

        mojis.forEach((moji,index)=>{

            const isKata = new RegExp(kataRegex,'').test(moji);
            let _fontSize = isKata?kataFontSize:fontSize;

            // if(index === 0 && firstWord !== 1){
            //     _fontSize *= firstWord;
            // }

            setCtxConfig(ctx,{
                textBaseline:'bottom',
                fontSize: _fontSize
            });

            ctx.fillText(
                moji,
                left, height
            );
            if(/、/.test(moji)){
                _fontSize = fontSize * pointWidthScale
            }
            left += _fontSize + letterSpacing;
        })
        removeCanvas(canvas);
        return canvas
    }
    const makeLinesCanvas = (texts,letterSpacing = 0)=>{
        const canvas = createCanvas();
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
        removeCanvas(canvas);
        return canvas;
    }
    const makeLinesDiffSizeCanvas = (texts,config = {})=>{
        const {
            lineHeight = 1,
        } = config
        const canvas = createCanvas();
        const ctx = canvas.getContext('2d');

        setCtxConfig(ctx,{
            // fontFamilyName:'Helvetica'
        });
        let allWidth = 0;
        let allHeight = 0;
        let maxHeight = 0;
        let lines = texts.map(text=>{
            const _canvas = makeTextCanvas(text)
            const width = _canvas.width;
            const height = _canvas.height;

            // const top = allHeight;
            // allHeight += height + letterSpacing;
            if(height > maxHeight){
                maxHeight = height;
            }

            if(width > allWidth){
                allWidth = width;
            }
            return {
                image:_canvas,
                text,
                width,
                height,
            }
        });
        let letterSpacing = 0;
        lines = lines.map(o=>{
            const scale = o.width / allWidth

            if(scale < 0.99){
                o.width = o.width * 0.7
                o.height = o.height * 0.7
            }
            letterSpacing = (lineHeight - 1) * o.height;

            const top = allHeight;
            allHeight += o.height + letterSpacing;
            
            o.top = top;
            return o
        });

        canvas.width = allWidth;
        canvas.height = allHeight - letterSpacing;
        lines.forEach(line=>{
            ctx.drawImage(
                line.image,
                0,line.top,
                line.width,line.height
            )
        })
        removeCanvas(canvas)
        return canvas;
    }


    const makeVerticalTextCanvas = (text,letterSpacing = 0)=>{
        const canvas = createCanvas();
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
            let { width , height } = measureText(ctx,text,fontSize);

            width = width - letterSpacing;
            height = height;

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
            ctx.translate(width/2, index * lineHeight + fontSize / 2)
            if(StartAndEndTagTestRegex.test(moji)|| /ー/.test(moji)){
                ctx.rotate(90 * Math.PI / 180);
            }
            ctx.fillText(
                moji,
                0,0
            );
            ctx.restore()
        })
        removeCanvas(canvas)
        return canvas

    }


    layout.make({
        canvas,
        ctx,
        texts,
        config: {
            width,
            height,
            scale,
            padding,
            fontSize,
            fontColor,
            backgroundColor,
            space,
        },
        functions: {
            randOne,
            setCtxConfig,
            makeTextCanvas,
            makeTextSizeDiffCanvas,
            makeLinesCanvas,
            makeLinesDiffSizeCanvas,
            makeVerticalTextCanvas,
        }
    });


   




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
    if(config.blur){

        const zoom = 1.4;
        if(zoom !== 1){
            const zoomWidth = width / zoom;
            const zoomheight = height / zoom;

            zoomCanvas.width = zoomWidth;
            zoomCanvas.height = zoomheight;
            const zoomCtx = zoomCanvas.getContext('2d');

            zoomCtx.drawImage(
                canvas,
                0,0,width,height,
                0,0,zoomWidth,zoomheight,
            )
            ctx.drawImage(
                zoomCanvas,
                0,0,zoomWidth,zoomheight,
                0,0,width,height
            )
        }

        let i = 1//config.blur;
        while(i--){
            blurFunc();
        }
    }

    const outLine = false;
    
    if(outLine){
        const outLineCanvas = createCanvas();
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



    let outputHeight = insetHeight;
    let outputWidth = insetWidth;

    let insetLeft = 0;
    let insetTop = 0;

    const renderRatio = width / height;


    if(outputRatio > renderRatio){
        outputWidth = Math.floor(outputHeight * outputRatio);
        insetLeft = (outputWidth - insetWidth) / 2;
    }else{
        outputHeight = Math.floor(outputWidth / outputRatio);
        insetTop = (outputHeight - insetHeight) / 2;
    }


    // const outputCanvas = createCanvas();
    const outputCtx = outputCanvas.getContext('2d');

    outputCanvas.width = outputWidth
    outputCanvas.height = outputHeight

    outputCtx.fillStyle = backgroundColor;
    outputCtx.fillRect(
        0, 0,
        outputWidth, outputHeight
    );

    outputCtx.drawImage(
        canvas,
        0,0,
        width,height,
        insetLeft,insetTop,
        insetWidth,insetHeight,
    )
    
    if(convolute || noise){

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
        if(noise){
            let pixelData = pixel.data;
            let seed = 18;
            // console.log({seed})
            for(let i = 0;i < pixelData.length;i += 4){
                let l = pixelData[i] *  .299000 + pixelData[i+1] *  .587000 + pixelData[i+2] *  .114000;
                let s = Math.round(rand(-seed,seed)) * (l/255 - 0.5);
                s = Math.floor(s)
                // console.log({s})

                pixelData[i   ] = pixelData[i   ] + s;
                pixelData[i+1 ] = pixelData[i+1 ] + s;
                pixelData[i+2 ] = pixelData[i+2 ] + s;
            }
        }


        if(convolute){
            let a = 0.35;
            pixel = convolutePixel(
                pixel,
                [
                    0, -a,  0,
                    -a, 1 +a*2,  a,
                    0, -a,  0
                ],
                outputCtx
            );
        
            blurFunc();
        }
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
    
    }


    if(type95){
        // const pixel = outputCtx.getImageData(0,0,outputWidth,outputHeight);
        // const pixelData = pixel.data;

        // for(let i = 0;i < pixelData.length;i += 4){
        //     const yuv = rgb2yuv(
        //         pixelData[i  ],
        //         pixelData[i+1],
        //         pixelData[i+2],
        //     );
    
        // 	yuv[0] = Math.max(yuv[0],50);
            
        // 	const _rgb = yuv2rgb(yuv);
    
        // 	pixelData[i   ] = _rgb[0];
        // 	pixelData[i+1 ] = _rgb[1];
        // 	pixelData[i+2 ] = _rgb[2];
        // }

        // outputCtx.putImageData(pixel,0,0);
        
    
        outputCtx.fillStyle = 'rgba(108,130,108,.14)';
        outputCtx.fillRect(
            0, 0,
            outputWidth,outputHeight
        );
    }

    if(timer) console.timeEnd(layout.title)

    removeCanvas(canvas);
    removeCanvas(outputCanvas);

    return outputCanvas
}




const convolutePixel = (pixels,weights,ctx)=>{
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
