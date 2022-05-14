const Fontmin = require('fontmin');
const { existsSync } = require('fs')
// 动态中文字体加载方案 https://zhuanlan.zhihu.com/p/349267844

module.exports = function (req, res) {
    console.time('a')
    // 字体源文件
    const srcPath = './EVA-Matisse_Classic.ttf';
    let {text,unicode} = req.query;
    if(!(existsSync(srcPath))) return res.end()
    
    if(unicode){
        text = unicode.split(/,/g).map(String.fromCharCode).join('')
    }
    // 文字去重
    text = Array.from(new Set(text)).sort().join('');

    if(!text)return res.end();
    // 初始化
    const fontmin = new Fontmin().src(srcPath).use(
        // 字型提取插件
        Fontmin.glyph({
            text // 所需文字
        })
    )
    // .use(Fontmin.ttf2woff({
    //     deflate: true           // deflate woff. default = false
    // }));

    fontmin.run(function (err, files, stream) {
        if (err) return console.error(err);

        console.log({files},files.map(file=>file.contents.length))

        // res.setHeader('content-type','font/woff');
        res.setHeader('content-type','font/ttf');
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('expires','Sun, 15 May 2222 02:30:55 GMT');
        res.status(200).send(files[0].contents);
        console.timeEnd('a')
    });
};