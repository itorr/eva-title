const Fontmin = require('fontmin');
const { existsSync } = require('fs')
// 动态中文字体加载方案 https://zhuanlan.zhihu.com/p/349267844
const Fonts = {
    'zpix':'zpix.ttf',
    'EVAMatisseClassic':'EVA-Matisse_Classic.ttf',
    'EVAMatisseStandard':'EVA-Matisse_Standard.ttf',
    'MatisseProEB':'FOT-MatissePro-EB.ttf',
    'RaglanStdUB':'FOT-RaglanStd-UB.ttf',
    'coco':'可口可乐在乎体.ttf',
}
module.exports = function (req, res) {
    console.time('buildFont');
    let {name,text,unicode} = req.query;
    const srcPath = 'fonts/'+Fonts[name];

    if(!srcPath) return res.end();

    if(!existsSync(srcPath)){
        // throw ([
        //     [srcPath,existsSync(srcPath)],
        //     ['./fontmin.html',existsSync('./fontmin.html')],
        //     ['../fontmin.html',existsSync('../fontmin.html')],
        // ])
        return res.end()
    } 

    if(unicode){
        text = unicode.split(/,/g).map(String.fromCharCode).join('')
    }
    text = Array.from(new Set(text)).sort().join('');

    if(!text)return res.end();
    // 初始化
    const fontmin = new Fontmin().src(srcPath).use(
        // 字型提取插件
        Fontmin.glyph({
            text // 所需文字
        })
    ).use(Fontmin.ttf2woff({
        deflate: true
    }));

    fontmin.run(function (err, files, stream) {
        if (err) return console.error(err);

        console.log({files},files.map(file=>file.contents.length),files[0].name)

        let file = files[1];
        if(!file) file = files[0];
        if(!file) return res.end();

        res.setHeader('content-type','font/woff');
        // res.setHeader('content-type','font/ttf');
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('expires','Sun, 15 May 2222 02:30:55 GMT');
        res.status(200).send(file.contents);
        console.timeEnd('buildFont');
    });
};