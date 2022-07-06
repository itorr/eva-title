module.exports = function (grunt) {

	grunt.registerMultiTask('cutjs', '修剪 JavaScript 代码', function () {
		
		var 
		r=[];

		this.files.forEach(function (file) {
			var src = file.src.forEach(function (filepath,b) {

				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('文件 ' + filepath + ' 不存在');
					return true;
				}else if(filepath.match(/3/)){
					grunt.log.writeln('跳过文件 ' + filepath);
					return true;
				}

				text=grunt.file.read(filepath);

				text=text.replace(/console\.log\(.+?\)/g,'');

				r.push(text);
				//console.log(text);
			});

			//console.log(file);


			
			grunt.file.write(file.dest,r.join(''));
	
			grunt.log.writeln('文件 ' + file.dest + ' 生成成功');
		});
	});

	grunt.registerMultiTask('suffixupdate', '版本号更新', function () {
		
		
		var 
		suffix=Math.floor(+new Date()/1000).toString(36);

		this.files.forEach(function (file) {
			file.src.forEach(function (filepath,b) {

				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('文件 ' + filepath + ' 不存在');
					return true;
				}

				text=grunt.file.read(filepath);

				text=text.replace(/<!-- #index\.css -->([\s\S]+?)<!-- \/index\.css -->/g,'<link rel="stylesheet" href="static/css/index.css?_r=zaq">');
				text=text.replace(/<!-- #build\.js -->([\s\S]+?)<!-- \/build\.js -->/g,`
					<script>
					suffix='suffix';

					!function(url,Stor,D,W){
						var 
						loadScript=function(url){
							var 
							script=D.createElement('script');
							script.setAttribute('src',url);
							D.body.appendChild(script);
						},
						evalScript=function(code){
							setTimeout(function(){
								W.eval(code);
							},1);
						};


						if(Stor){
							if(
								Stor.build
								&&
								Stor.suffix==suffix
							){
								evalScript(Stor.build);
							}else{
								var 
								x=new XMLHttpRequest();
								x.open('GET',url,1);
								x.onload=function(){
									var 
									r=x.responseText;

									if(!r){
										return loadScript(url);
									}
									
									Stor.build=r;

									evalScript(Stor.build);

									Stor.suffix=suffix;
								}
								x.send();
							}
						}else{
							loadScript(url);
						}

					}('static/js/build.js?_r='+suffix,this.localStorage,document,this);
					</script>
				`);


				text=text.replace(/suffix='\w{3,20}'/g,'suffix=\''+suffix+'\'');
				text=text.replace(/_r=\w{3,20}/g,'_r='+suffix);


				grunt.file.write(file.dest,text);

				grunt.log.writeln('文件 ' + filepath+ ' 版本号更新成功');

			});

		});
	});
	grunt.registerMultiTask('htmlfix', 'htmlFix', function () {
		
		
		var 
		suffix=Math.floor(+new Date()/1000).toString(36);

		this.files.forEach(function (file) {
			file.src.forEach(function (filepath,b) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('文件 ' + filepath + ' 不存在');
					return true;
				}

				let text = grunt.file.read(filepath);

                text = text.replace(/<!--merge:js-->([\s\S]+?)<!--merge:js-->/,(all,html)=>{

                    const match = html.match(/src="(.+?\.js)"/ig)
                    if(match){
                        const jsFiles = match.map(text=>text.match(/src="(.+?\.js)"/i)[1])
                        let dustText = jsFiles.map(filePath=>{
                            if (!grunt.file.exists(filePath)) {
                                grunt.log.warn('文件 ' + filePath + ' 不存在');
                                return '';
                            }
                            return grunt.file.read(filePath);
                        }).join(';');
                        
				        // dustText = dustText.replace(/console\.\w+\(.+?\)/g,'');
						// dustText = dustText.replace(/\n\s+/g,';');

                        grunt.file.write(`dest/c.js`,dustText);
                    }
                    return `<script src="c.js?r=${suffix}"></script>`;
                })
                text = text.replace(/<!--merge:css-->([\s\S]+?)<!--merge:css-->/,(all,html)=>{
                    const match = html.match(/href="(.+?\.css)"/ig)
                    if(match){
                        const styleFiles = match.map(text=>text.match(/href="(.+?\.css)"/i)[1])

                        const dustText = styleFiles.map(filePath=>{
                            console.log(filePath)
                            if (!grunt.file.exists(filePath)) {
                                grunt.log.warn('文件 ' + filePath + ' 不存在');
                                return '';
                            }
                            return grunt.file.read(filePath);
                        }).join('');
                        grunt.file.write('dest/i.css',dustText);
                    }
                    return `<link rel="stylesheet" href="i.css?r=${suffix}">`;
                })


				text=text.replace(/\n\s+/g,' ');

				grunt.file.write(file.dest,text);

				grunt.log.writeln('网页文件 ' + filepath+ ' fix');

			});

		});
	});
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			main: {
				expand: true,
				src: 'static/img/**',
				dest: 'dest/',
			},
		},
		less:{
			build:{
				files:{
					'css/base.css': 'css/base.less',
					'css/marker.css': 'css/marker.less',
				}
			}
		},
		// 'sftp-deploy': {
		// 	build: {
		// 		auth: {
		// 			host: '192.168.2.200',
		// 			port: 22222,
		// 			authKey: 'key1'
		// 		},
		// 		cache: 'sftpCache.json',
		// 		src: './dest',
		// 		dest: '/usr/local/nginx/html/toto/dest',
		// 		exclusions: ['.DS_Store'],
		// 		serverSep: '/',
		// 		localSep: '/',
		// 		concurrency: 4,
		// 		progress: true
		// 	}
		// },
		htmlfix:{
			build:{
				files:{
					'dest/index.html':'index.html',
				}
			}
		},

		uglify: {
			options:{
				mangle: true,
				compress: true,
			},
			build: {
				files: {
					'dest/c.js':'dest/c.js',
				}
			}
		},
		cssmin: {
			compress: {
				files: {
					'dest/i.css':'dest/i.css',
				}
			}
		},
		htmlmin: {
			build:{
				options: {
					removeComments: true,
					removeCommentsFromCDATA: true,
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true,
					minifyJS: 1
				},
				files: {
					'dest/index.html':'dest/index.html'
				}
			}
		},
		shell: {
			multiple:{
				command:[
					'git add dest/**',
					'git commit -m "grunt"',
					'git push'					
				].join('&&')
			}
		}
		
	});


	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-shell');

	// grunt.loadNpmTasks('grunt-git');

	// 默认任务
	grunt.registerTask('default', [
		// 'itemplet',

		// 'less',

		// 'copy',
		'htmlfix',
		'uglify',
		'cssmin',
		'htmlmin',
		// 'shell',
		// 'sftp-deploy',
		// 'gitcommit',
		// 'gitpush'
	]);//
}