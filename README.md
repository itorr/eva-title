

# 🐧 福音战士标题生成器 - Evangelion Title Card Generator
又一个福音战士标题生成器

## 在线地址
https://lab.magiconch.com/eva-title/

## 功能
- [x] 自定义文字
- [x] 黑底白字
- [x] 白底黑字
- [x] 黑底红字
- [x] 模糊
- [x] 噪点
- [x] 锐化
- [x] 模仿95版画面
- [x] 保留输入原文，提示当前字型缺失的字符及 Unicode 码位
- [x] 输出画面比例 `2022-09-03`

## 说明
预览和图片导出使用同一套标题字型。页面会列出缺字及码位，并在预览和保存的图片中为缺字留出空白。

## 配置静态字体

默认资源是 `html/title-font.json` 和 `html/base-split.woff`。发布前端时，将清单放在 `index.html` 同级，保留其中字体的相对路径。以 HTTP 或 HTTPS 提供这些文件。

若部署有网页分发授权的 WOFF2，将它以带版本号的文件名放在发布暂存目录下的 `fonts/`，然后从该文件生成同级清单。以下示例中的 `<站点目录>` 指包含 `index.html` 的暂存目录。

```sh
python -m pip install "fonttools[woff]"
python scripts/make-font-manifest.py "<站点目录>/fonts/title-v1.woff2" "<站点目录>/title-font.json"
```

先上传字体，再更新清单。每次更换字体都重新生成清单。清单根据字体的 Unicode cmap 生成，包含有轮廓的字形和空格字符，并支持补充平面码位。

## 生产构建

```sh
npm ci
npm run build
```

默认构建输出到 `dest/production/`，使用内置字体。原生 ES 模块合并压缩成一个业务脚本，Less 编译成压缩样式，HTML 注释在构建时移除。脚本和样式文件名包含内容哈希。

使用已有的楔明朝轮廓分片在本机验证同一生产构建：

```sh
npm run build -- --outlines "<轮廓分片目录>"
```

构建读取轮廓生成器产出的 `entry.bin`、`templates.bin`、索引、分片及对应的 `.br` 文件，输出到独立的 `dest/outline-preview/`。可在参数中指定其他输出目录。支持预压缩文件的本地服务可在请求接受 Brotli 时以原 URL 返回同名 `.br`，并设置 `Content-Encoding: br`；普通静态服务可直接提供原文件。研究字体与分片只用于本机验证。

缺字上报走同源的 `POST /api/log/font-missing`。请求只包含字体版本和缺字码位，接口写入成功后返回 `204`。浏览器按字体版本记录已确认的码位。

## 已解决的大问题
- [x] Safari 下 EVAMatisseClassic 字体无法正常绘制
- [x] Firefox 下 canvas 无法正常绘制

fix: 解决了firefox的问题，可能解决了safari的问题 [#10](https://github.com/itorr/eva-title/pull/10)

所以现在 iOS、Mac Safari、Firefox 都可以用啦~

## 字体
https://mojimo.jp/eva/

## GitHub
https://github.com/itorr/eva-title

## 标题参考
https://zh.wikipedia.org/wiki/新世纪福音战士
