const layouts = [
    {
        id: 'e1',
        title: '第壱話 使徒、襲来',
        inputs:[
            {
                placeholder:'使徒',
                minLength:2,
                maxLength:8,
            },
            {
                placeholder:'襲来',
                minLength:2,
                maxLength:8,
            },
            {
                placeholder:'第壱話',
                minLength:0,
                maxLength:6,
            }
        ],
        config:{
            noise: true,
        },
        exemples: [
            // [
            //     '媽的',
            //     '好熱',
            //     '不想上班'
            // ]
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [a,b,sub] = texts;
            const aLength = a.length;
            const bLength = b.length;

            const titleCanvas = (_=>{
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const verticalCanvas = makeVerticalTextCanvas(a,-space)
                const pointCanvas = makeTextCanvas('、')
                const horizontalCanvas = makeTextCanvas(b,-space,padding)

                const width = Math.ceil( horizontalCanvas.width / bLength * (bLength+0.3) ) + verticalCanvas.width + padding
                const height = verticalCanvas.height

                canvas.width = width
                canvas.height = height

                ctx.drawImage(
                    verticalCanvas, 0,0
                )
                ctx.drawImage(
                    pointCanvas,
                    verticalCanvas.width - space * 2, height - horizontalCanvas.height
                )
                ctx.drawImage(
                    horizontalCanvas, 
                    verticalCanvas.width * 1.3, height - horizontalCanvas.height + padding / 3
                )
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
                let titleWidth = Math.min( titleHeight / titleCanvas.height * titleCanvas.width, width - padding )
                ctx.drawImage(
                    titleCanvas,
                    padding , padding + subHeight,
                    titleWidth , titleHeight
                )
            }else{

                let titleHeight = height - padding * 2
                let titleWidth = Math.min(titleHeight / titleCanvas.height * titleCanvas.width , width - padding )
                ctx.drawImage(
                    titleCanvas,
                    padding , (height - titleHeight) / 2,
                    titleWidth , titleHeight
                )
            }
        }
    },
    {
        id: 'e13',
        title: '第拾参話 使徒、侵入',
        inputs:[
            {
                placeholder:'使徒',
                minLength:2,
                maxLength:8,
            },
            {
                placeholder:'侵入',
                minLength:2,
                maxLength:8,
            },
            {
                placeholder:'第拾参話',
                minLength:0,
                maxLength:6,
            }
        ],
        exemples:[

            [
                'ネルフ',
                '誕生',
                '第弐拾壱話'
            ],
            [
                'せめて、人間',
                'らしく',
                '第弐拾弐話'
            ]
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                fontSize,
                space,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [a,b,sub] = texts;
            const aLength = a.length;
            const bLength = b.length;

            const titleCanvas = (_=>{
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const aCanvas = makeTextSizeDiffCanvas(a,-space)
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
            
            if(sub){
                const subCanvas = makeTextCanvas(sub,-space)
                let subHeight = height * 0.19;
                let subWidth = subHeight / subCanvas.height * subCanvas.width;
            
                ctx.drawImage(
                    subCanvas,
                    padding,height - padding - subHeight,
                    subWidth,subHeight
                );
            }

        }
    },
    {
        id: 'e25',
        title: '第弐拾伍話 終わる世界',
        inputs:[
            {
                placeholder:'終わる世界',
                minLength:2,
                maxLength:14,
            },
            {
                placeholder:'第弐拾伍話',
                minLength:2,
                maxLength:14,
            }
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [text,sub] = texts;


            // 标题在中
            const textCanvas = makeTextSizeDiffCanvas(text,-space * 1.4)
            ctx.drawImage(
                textCanvas,
                width * 0.2,height * 0.44,
                width * 0.6,height/4
            )
            
            if(sub){
                let subCanvas = makeTextCanvas(sub,-space)
                let subHeight = height * 0.12;
                let subWidth = subHeight / subCanvas.height * subCanvas.width * 0.8;
            
                ctx.drawImage(
                    subCanvas,
                    (width - subWidth) / 2, height * 0.26,
                    subWidth,subHeight
                );
            }
        
        }
    },
    {
        id: 'e12',
        title: '第拾弐話 奇跡の価値は',
        inputs:[
            {
                placeholder:'奇跡の価値は',
                minLength:2,
                maxLength:14,
            },
            {
                placeholder:'第拾弐話',
                minLength:2,
                maxLength:14,
            }
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [text,sub] = texts;

            // 标题在上
            const textCanvas = makeTextSizeDiffCanvas(text,-space * 1.4)
            const textWidth = width - padding * 2
            const textHeight = Math.min(textWidth / textCanvas.width * textCanvas.height * 1.4,height / 2)
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
                    // (width - subWidth) / 2, //center
                    // width - subWidth - padding // right
                ]);

                ctx.drawImage(
                    subCanvas,
                    subLeft, height - subHeight - padding * 2,
                    subWidth,subHeight
                );
            }
        }
    },
    {
        id: 'e3',
        title: '第参話 鳴らない、電話',
        inputs:[
            {
                placeholder:'鳴らない、電話',
                minLength:2,
                maxLength:14,
            },
            {
                placeholder:'第参話',
                minLength:2,
                maxLength:14,
            }
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [text,sub] = texts;

            let sliceIndex = Math.round(text.length * 0.8)
            const a = text.slice(0,sliceIndex)
            const b = text.slice(sliceIndex)

            // 标题在上
            const aCanvas = makeTextSizeDiffCanvas(a,-space * 1.4)
            const aWidth = width - padding * 5
            const aHeight = Math.min(aWidth / aCanvas.width * aCanvas.height * 1.15,height / 2)
            ctx.drawImage(
                aCanvas,
                padding * 2, padding * 1.5,
                aWidth, aHeight
            )

            const bCanvas = makeTextSizeDiffCanvas(b,-space * 1.4)
            const bHeight = aHeight * 0.95
            const bWidth = Math.min(bHeight * bCanvas.width / bCanvas.height,height / 2) * 0.9

            const bottomPadding = padding * 2.5
            ctx.drawImage(
                bCanvas,
                padding * 2, height - bHeight - bottomPadding,
                bWidth, bHeight
            )
            
            if(sub){
                let subCanvas = makeVerticalTextCanvas(sub,-space)
                let subHeight = height * 0.32;
                let subWidth = subHeight / subCanvas.height * subCanvas.width * 1.1;
            
                ctx.drawImage(
                    subCanvas,
                    width - subWidth - padding * 4, height - subHeight - bottomPadding,
                    subWidth,subHeight
                );
            }
        }
    },
    {
        id: 'e25-2',
        title: '第弐拾伍話 終わる世界',
        inputs:[
            {
                placeholder:'終わる世界',
                minLength:2,
                maxLength:14,
            },
            {
                placeholder:'第弐拾伍話',
                minLength:2,
                maxLength:14,
            },
            {
                type:'tab',
                name:'大标题位置',
                options:[
                    {
                        "value": 0,
                        "text": "偏下"
                    },
                    {
                        "value": 1,
                        "text": "偏左"
                    },
                    {
                        "value": 2,
                        "text": "偏右"
                    }
                ]
            },
            {
                type:'tab',
                name:'小标题位置',
                options:[
                    {
                        "value": 0,
                        "text": "起始"
                    },
                    {
                        "value": 1,
                        "text": "居中"
                    },
                    {
                        "value": 2,
                        "text": "结束"
                    }
                ]
            },
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [text,sub,a,b] = texts;

            // console.log(text,sub,a,b)

            randOne([
                _=>{
                    // 标题在下
                    const textCanvas = makeTextSizeDiffCanvas(text,-space * 1.4)
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
                        ],b);
    
                        ctx.drawImage(
                            subCanvas,
                            subLeft, padding * 2,
                            subWidth,subHeight
                        );
                    }
                },
                _=>{
                    // 标题在左 sub在右
                    const textCanvas = makeVerticalTextCanvas(text,-space * 1.4)
                    const textHeight = height - padding * 2
                    const textWidth = Math.min(textHeight / textCanvas.height * textCanvas.width, width - padding * 2) * rand(0.8,1.4)
                    
                    ctx.drawImage(
                        textCanvas,
                        padding, padding,
                        textWidth, textHeight
                    )
                    
                    if(sub){
                        let subCanvas = makeTextCanvas(sub,-space)
                        let subHeight = height * 0.18;
                        let subWidth = Math.min(
                            subHeight / subCanvas.height * subCanvas.width * 0.8,
                            width - textWidth - padding * 2
                        );
                        const subLeft = width - padding - subWidth;

                        const subTop = randOne([
                            padding,
                            (height - subHeight) / 2, // middle
                            height - subHeight - padding
                        ],b);
                        ctx.drawImage(
                            subCanvas,
                            subLeft, subTop,
                            subWidth,subHeight
                        );
                    }
                },
                _=>{
                    // 标题在右 sub在左
                    const textCanvas = makeVerticalTextCanvas(text,-space * 1.4)
                    const textHeight = height - padding * 2
                    const textWidth = Math.min(textHeight / textCanvas.height * textCanvas.width, width - padding * 2) * rand(0.8,1.4)
                    
                    ctx.drawImage(
                        textCanvas,
                        width - padding - textWidth, padding,
                        textWidth, textHeight
                    )
                    
                    if(sub){
                        let subCanvas = makeTextCanvas(sub,-space)
                        let subHeight = height * 0.18;
                        let subWidth = Math.min(
                            subHeight / subCanvas.height * subCanvas.width * 0.8,
                            width - textWidth - padding * 2
                        );
                        const subLeft = padding;

                        const subTop = randOne([
                            padding,
                            (height - subHeight) / 2, // middle
                            height - subHeight - padding
                        ],b);
                        ctx.drawImage(
                            subCanvas,
                            subLeft, subTop,
                            subWidth,subHeight
                        );
                    }
                },
            ],a)();
        }
    },
    {
        id: 'e4',
        title: '第四話 雨、逃げ出した後',
        inputs:[
            {
                placeholder:'雨',
                length:1,
            },
            {
                placeholder:'逃げ出した後',
                minLength:2,
                maxLength:14,
            },
            {
                placeholder:'第四話',
                minLength:2,
                maxLength:10
            }
        ],
        exemples:[
            [
                '決戦',
                '第3新東京市',
                '第六話'
            ],
            [
                '請',
                '我吃麦当勞',
                '求求了'
            ],
            // [
            //     '使徒',
            //     '侵入',
            //     '第拾参話',
            // ],
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [a,b,sub] = texts;

            const aCanvas = makeTextCanvas(a,-space)

            const aHeight = height * 0.43
            let maxaWidth = width * 0.5;

            if(b.length <= 2){
                maxaWidth = width * 0.54
            }

            const aWidth = Math.min( aHeight / aCanvas.height * aCanvas.width , maxaWidth );
            const aPaddingScale = 1 - (b.length - a.length) / 10
            // console.log({aPaddingScale})
            ctx.drawImage(aCanvas, 
                padding , padding + padding * aPaddingScale,
                aWidth, aHeight,
            )

            const pointCanvas = makeTextCanvas('、')
            ctx.drawImage(
                pointCanvas, 
                padding + aWidth - width * 0.02, padding * 2 ,
                width * 0.24, width * 0.35,
            )


            const bCanvas = (_=>{
                // b字符需要拐个弯
                const bSliceIndex = Math.floor(b.length/2)
                const ba = b.slice(0,bSliceIndex)
                const bb = b.slice(bSliceIndex)
                // console.log({ba,bb})

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
            })()//:makeVerticalTextCanvas(b,-space);

            let bWidth = width * 0.5 - padding
            let bHeight = bWidth / bCanvas.width * bCanvas.height
            
            const maxbHeight = (height - padding * 4);
            if(bHeight > maxbHeight){
                bHeight = maxbHeight;
                bWidth = bHeight / bCanvas.height * bCanvas.width;
            }
            ctx.drawImage(bCanvas, 
                width - bWidth - padding * 2, padding * 2,
                bWidth, bHeight
            )


            const subCanvas = makeTextCanvas(sub,-space)
            let subHeight = height * 0.19;
            let subWidth = subHeight / subCanvas.height * subCanvas.width;
        
            ctx.drawImage(
                subCanvas,
                padding * 1.5,height - padding - subHeight - space * 2,
                subWidth,subHeight
            );
        }
    },
    {
        id: 'air',
        title: 'air',
        inputs:[
            {
                placeholder:'air',
                minLength:2,
                maxLength:20,
            },
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
                fontColor,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [text,sub] = texts;

                // [air]
                // 小于十个字符 框框
                // const textCanvas = makeTextSizeDiffCanvas(text,-space);
                const textCanvas = makeTextCanvas(text);
                const _config = randOne([
                    {
                        heightScale: 0.2,
                        padding: padding,
                        borderWidth: space * 0.5,
                    },
                    // {
                    //     heightScale: 0.4,
                    //     padding: padding * 1.5,
                    //     borderWidth: space
                    // },
                    // {
                    //     heightScale: 0.6,
                    //     padding: padding * 2,
                    //     borderWidth: space * 1.5
                    // },
                ]);
                const textHeight = height * _config.heightScale;
                const textWidth = Math.min(textHeight * textCanvas.width / textCanvas.height, width * 0.8);

                ctx.drawImage(
                    textCanvas,
                    (width - textWidth) / 2, ( height - textHeight ) / 2,
                    textWidth,textHeight
                );
                ctx.strokeStyle = fontColor;
                ctx.lineWidth = _config.borderWidth;
                const rectWidth  = textWidth + _config.padding * 2;
                const rectHeight = textHeight + _config.padding;

                const rectLeft = (width - rectWidth) / 2;
                const rectTop = (height - rectHeight) / 2;
                ctx.strokeRect(
                    rectLeft, rectTop,
                    rectWidth, rectHeight
                );

        }
    },
    // {   //书名号包裹的情况
    //     title: '最後のシ者',
    //     inputs:[
    //         {
    //             placeholder:'最後のシ者',
    //             minLength:2,
    //             maxLength:10,
    //         },
    //     ],
    //     exemples:[
    //         // [
    //         //     '【在世界中心呼喊】'
    //         // ]
    //     ],
    //     make:({
    //         canvas,
    //         ctx,
    //         texts,
    //         config,
    //         functions,
    //     })=>{
    //         const {
    //             width,
    //             height,
    //             scale,
    //             padding,
    //             space,
    //             fontColor,
    //         } = config;
            
    //         const {
    //             randOne,
    //             setCtxConfig,
    //             makeTextCanvas,
    //             makeTextSizeDiffCanvas,
    //             makeLinesCanvas,
    //             makeLinesDiffSizeCanvas,
    //             makeVerticalTextCanvas,
    //         } = functions;

    //         const [text,sub] = texts;

    //         let titleCanvas = makeTextSizeDiffCanvas(text,-space)
    //         const _padding = padding * 2; 
    //         let titleWidth;
    //         let titleHeight;
    //         let titleTop = _padding;
    //         let titleLeft = _padding;
    //         let titleScale = titleCanvas.width / titleCanvas.height;

    //         titleWidth = width - _padding * 2;
    //         titleHeight = titleWidth / titleScale * 1.2
    //         titleTop = (height - titleHeight) / 2
    

    //         ctx.drawImage(
    //             titleCanvas,
    //             titleLeft , titleTop,
    //             titleWidth, titleHeight
    //         )

    //     }
    // },
    {   //书名号包裹的情况
        id: 'e24',
        title: '最後のシ者',
        inputs:[
            {
                placeholder:'最後のシ者',
                minLength:2,
                maxLength:14,
            },
        ],
        exemples:[
        ],
        config:{
            plan:'wb'
        },
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
                fontColor,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [text,sub] = texts;

            let titleCanvas = makeVerticalTextCanvas(text,-space)
            const _padding = padding * 2; 
            let titleWidth;
            let titleHeight;
            let titleTop = _padding;
            let titleLeft = _padding;
            let titleScale = titleCanvas.width / titleCanvas.height;

                titleHeight = height - _padding * 2;
                titleWidth = titleHeight * titleScale * 1.2
                titleLeft = (width - titleWidth) / 2;

                ctx.drawImage(
                titleCanvas,
                titleLeft , titleTop,
                titleWidth, titleHeight
            )

        }
    },
    {   //大于十个字符 六字多排 世界中心呼唤
        id:'e26',
        title: '最終話 世界の中心でアイを叫んだけもの',
        inputs:[
            {
                placeholder:'世界の中心でアイを叫んだけもの',
                minLength:2,
                maxLength:40,
            },
            {
                placeholder:'最終話',
                minLength:2,
                maxLength:14,
            },
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
                fontColor,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [text,sub] = texts;

            const _texts = new Array(Math.ceil(text.length/6)).fill(1).map((_,index)=>{
                const start = index * 6;
                const end = start + 6;
                return text.slice(start,end)
            })
            const titleCanvas = makeLinesCanvas(_texts,-space * 1.5);
            ctx.drawImage(
                titleCanvas,
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

        }
    },
    {
        id:'anno-kandoku',
        title: '監督 庵野秀明',
        inputs:[
            {
                placeholder:'庵野秀明',
                minLength:2,
                maxLength:14,
            },
            {
                placeholder:'監督',
                minLength:2,
                maxLength:14,
            },
        ],
        exemples:[
            [
                'アスカ、来日',
                '第八話'
            ],
            // [
            //     'レイ、心のむこうに',
            //     '第伍話'
            // ],
            [
                'ゼーレ、魂の座',
                '第拾四話'
            ],
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
                fontColor,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [a,b] = texts;

            // ┗
            const titleCanvas = (_=>{
                
                let aSliceIndex = Math.floor(a.length/2)

                const pointIndex = a.indexOf('、')
                if(pointIndex !== -1) aSliceIndex = pointIndex

                const aa = a.slice(0,aSliceIndex)
                const ab = a.slice(aSliceIndex)


                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const verticalCanvas = makeVerticalTextCanvas(aa,-space)
                const horizontalCanvas = makeTextSizeDiffCanvas(ab,-space)

                const width = horizontalCanvas.width + verticalCanvas.width - space
                const height = verticalCanvas.height

                canvas.width = width
                canvas.height = height

                ctx.drawImage(verticalCanvas, 0,0)
                ctx.drawImage(
                    horizontalCanvas, 
                    width - horizontalCanvas.width - space, 
                    height - horizontalCanvas.height + padding / 3
                )
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

        }
    },
    {
        id:'e15',
        title: '第拾伍話 嘘と沈黙',
        inputs:[
            {
                placeholder:'嘘と沈黙',
                minLength:2,
                maxLength:14,
            },
            {
                placeholder:'第拾伍話',
                minLength:2,
                maxLength:14,
            },
        ],
        exemples:[
            [
                '石森章太郎',
                '原作'
            ],
            // [
            //     '嘘と沈黙',
            //     '第拾伍話'
            // ]
        ],
        config:{
            plan:'wb'
        },
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
                fontColor,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [a,b] = texts;
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
            let subHeight = Math.min(subWidth * subCanvas.height / subCanvas.width * 1.1,height/2);
            subWidth = Math.min(subWidth,subHeight /subCanvas.height * subCanvas.width *1.2 );
            ctx.drawImage(
                subCanvas,
                padding,padding * 2,
                subWidth,subHeight
            );

            let titleWidth = width - padding * 6 - subWidth
            let titleHeight = Math.max( titleWidth / titleCanvas.width * titleCanvas.height , height * 0.6)
            ctx.drawImage(
                titleCanvas,
                width - titleWidth - padding * 3 , height - titleHeight - padding * 2,
                titleWidth , titleHeight
            )
        }
    },
    {
        id:'eng-title',
        title: 'NEON GENESIS EVANGELION Rei II',
        inputs:[
            {
                placeholder:'NEON GENESIS EVANGELION',
                minLength:2,
                maxLength:40,
            },
            {
                placeholder:'EPISODE:13',
                minLength:2,
                maxLength:20,
            },
            {
                placeholder:'Rei II',
                minLength:2,
                maxLength:14,
            },
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
                fontColor,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [a,b,c] = texts;
            



            const engs = a.split(/\s+/g);
            const titleCanvas = makeLinesDiffSizeCanvas(engs,{lineHeight:0.9})
            
            let titleWidth = width - padding * 2
            let titleHeight = titleWidth / titleCanvas.width * titleCanvas.height * 1.3;
            let maxTitleHeight = height * 0.6
            titleHeight = Math.min(titleHeight,maxTitleHeight)
            // titleWidth = Math.min(titleWidth,width - padding * 2)
            ctx.drawImage(
                titleCanvas,
                padding , padding,
                titleWidth , titleHeight
            );
    
    
            const bCanvas = makeTextCanvas(b,-space)
            let bHeight = height * 0.16;
            let bWidth = bHeight / bCanvas.height * bCanvas.width *0.7;
        
            ctx.drawImage(
                bCanvas,
                padding,titleHeight + padding * 1.4,
                bWidth, bHeight
            );

            const cCanvas = makeTextCanvas(c,-space)
            let cHeight = height * 0.2;
            let cWidth = cHeight / cCanvas.height * cCanvas.width;
        
            ctx.drawImage(
                cCanvas,
                width - cWidth - padding,height - padding - cHeight,
                cWidth, cHeight
            );


        }
    },
    {
        id:'do-you-love-me',
        title: 'Do you love me?',
        inputs:[
            {
                placeholder:'Do you love me?',
                minLength:2,
                maxLength:20,
            },
            {
                placeholder:'EPISODE:25',
                minLength:2,
                maxLength:20,
            },
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
                fontColor,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            const [text,sub] = texts;
            

            const textCanvas = makeTextSizeDiffCanvas(text,-4)
            const textWidth = width * 0.8;
            const textHeight = Math.min(textWidth / textCanvas.width * textCanvas.height * 1.8, height * 0.8);


            if(sub){
                let subCanvas = makeTextCanvas(sub,-space)
                let subHeight = height * 0.11;
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
    },
    {   //大于十个字符 六字多排 世界中心呼唤
        id:'e20',
        title: '第弐拾話 心のかたち 人のかたち',
        inputs:[
            {
                placeholder:'心のかたち',
                minLength:2,
                maxLength:14,
            },
            {
                placeholder:'人のかたち',
                minLength:2,
                maxLength:14,
            },
            {
                placeholder:'第弐拾話',
                minLength:2,
                maxLength:14,
            },
        ],
        exemples:[
            [
                '今日臭臭臭',
                '明日香香香',
                '最喜歡的一話',
            ],
        ],
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
                fontColor,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            let [a,b,sub] = texts;

            const af = a.substr(0,1)
            a = a.substr(1)

            const bf = b.substr(0,1)
            b = b.substr(1)

            const afCanvas = makeTextCanvas(af);
            ctx.drawImage(
                afCanvas,
                padding * 2, height * 0.06,
                width * 0.3,height * 0.4
            );

            const aCanvas = makeTextSizeDiffCanvas(a,-space);
            ctx.drawImage(
                aCanvas,
                width * 0.3 + padding * 1.5, height * 0.15,
                width * 0.5,height * 0.3
            )

            const bfCanvas = makeTextCanvas(bf);
            ctx.drawImage(
                bfCanvas,
                padding * 2, height * 0.55,
                width * 0.3,height * 0.4
            );
            const bCanvas = makeTextSizeDiffCanvas(b,-space);
            ctx.drawImage(
                bCanvas,
                width * 0.3 + padding * 1.5, height * 0.65,
                width * 0.5,height * 0.3
            )

            if(sub){
                const subCanvas = makeTextCanvas(sub,-space)
                let subHeight = height * 0.14;
                let subWidth = subHeight / subCanvas.height * subCanvas.width * 0.9;
            
                ctx.drawImage(
                    subCanvas,
                    width - subWidth - padding * 2, (height) / 2,
                    subWidth,subHeight
                );
            }

        }
    },
    {   //两排兜底
        id:'e10',
        title: '第拾話 マグマダイバー',
        inputs:[
            {
                placeholder:'マグマ',
                minLength:2,
                maxLength:14,
            },
            {
                placeholder:'ダイバー',
                minLength:2,
                maxLength:14,
            },
            {
                placeholder:'第拾話',
                minLength:2,
                maxLength:14,
            },
        ],
        config:{
            plan:'br',
            noise:true,
        },
        make:({
            canvas,
            ctx,
            texts,
            config,
            functions,
        })=>{
            const {
                width,
                height,
                scale,
                padding,
                space,
                fontColor,
            } = config;
            
            const {
                randOne,
                setCtxConfig,
                makeTextCanvas,
                makeTextSizeDiffCanvas,
                makeLinesCanvas,
                makeLinesDiffSizeCanvas,
                makeVerticalTextCanvas,
            } = functions;

            // console.log(/两排托底/,texts);
            if(texts.length){
                const aCanvas = makeLinesCanvas(texts.slice(0,2),-space * 1.4)
                ctx.drawImage(
                    aCanvas,
                    width * 0.1, height * 0.05,
                    width * 0.85, height * 0.7,
                )
            }

            const sub = texts[2];

            const subCanvas = makeTextCanvas(sub,-space)
            let subHeight = height * 0.19;
            let subWidth = subHeight / subCanvas.height * subCanvas.width;
        
            ctx.drawImage(
                subCanvas,
                width - padding- subWidth,height - padding - subHeight,
                subWidth,subHeight
            );

        }
    },
    

]