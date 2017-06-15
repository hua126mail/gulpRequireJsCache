//更新时间：2017-06-15
var gulp = require('gulp'),
	sass = require('gulp-sass'),						//编译sass
	cssmin = require('gulp-clean-css'),					//压缩css
	autoprefixer = require('gulp-autoprefixer'),		//添加浏览器前缀
	rev = require('gulp-rev'),							//添加版本号
	revCollector = require('gulp-rev-collector'),		//添加版本号
	clean = require('gulp-clean'),						//清理文目标文件夹
	csso = require('gulp-csso'),						//合并css属性
	csslint = require('gulp-csslint'),					//css语法检查
	csscomb = require('gulp-csscomb'),					//css 样式表的各属性的顺序
	imagemin = require('gulp-imagemin'),				//图片压缩
	cache = require('gulp-cache'),						//缓存处理
	htmlmin = require('gulp-htmlmin'),					//压缩html
	replace = require('gulp-replace'),					//替换路径
	uglify = require('gulp-uglify'),					//压缩js
	jshint = require('gulp-jshint')						//js语法检查
;

gulp.task("cleanCss",function(){
	return gulp.src('dist/css',{read:false})
	.pipe(clean());
});

gulp.task('sass', ['cleanCss'],function () {			//执行完cleanCss任务后再执行sass任务
  	gulp.src('src/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssmin())
    .pipe(autoprefixer())
    //.pipe(csscomb())
    .pipe(csso())
    .pipe(csslint())
    .pipe(rev())
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest())//- 生成一个rev-manifest.json
    .pipe(gulp.dest('rev/css'));
    
});

gulp.task("cleanImg",function(){
	return gulp.src('dist/img',{read:false})
	.pipe(clean());
});

gulp.task('imgmin',['cleanImg'], function () {
    gulp.src('src/img/**/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin()))						//没有修改的图片直接从缓存文件读取
        .pipe(rev())
        .pipe(gulp.dest('dist/img'))
        .pipe(rev.manifest())//- 生成一个rev-manifest.json
    	.pipe(gulp.dest('rev/img'));
});

gulp.task("cleanJs",function(){
	return gulp.src(['dist/js/*','!dist/js/lib'],{read:false})
	.pipe(clean());
})

gulp.task('jsmin', ['cleanJs'], function () {
    gulp.src(['src/js/**/*.js','!src/js/**/*.min.js'])
    	.pipe(jshint())
        .pipe(uglify())
        .pipe(rev({merge:true}))
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())//- 生成一个rev-manifest.json
    	.pipe(gulp.dest('rev/js'));
    	
    gulp.src(['src/js/lib/**/*.js'])
        .pipe(gulp.dest('dist/js/lib'))
});

gulp.task('htmlmin',function () {
    var options = {
        removeComments: true,//清除HTML注释
        //collapseWhitespace: true,//压缩HTML
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/html/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'))
});


gulp.task('replaceURL', function(){
    gulp.src(['dist/html/**/*.html'])
        .pipe(replace('../css', '/css'))
        .pipe(replace('../js', '/js'))
        .pipe(replace('/src', '/dist'))
        .pipe(gulp.dest('dist/html'));
        
    gulp.src(['dist/css/**/*.css'])
        .pipe(replace('../css', '/css'))
        .pipe(replace('../js', '/js'))
        .pipe(replace('/src', '/dist'))
        .pipe(gulp.dest('dist/css'));
        
    gulp.src(['dist/js/**/*.js'])
        .pipe(replace('../css', '/css'))
        .pipe(replace('../js', '/js'))
        .pipe(replace('/src', '/dist'))
        .pipe(gulp.dest('dist/js'));
    
});

gulp.task('revUrl', function() {
    gulp.src(['rev/{css,img,js}/*.json', 'dist/html/**/*.html'])		//- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    .pipe(revCollector())                               				//- 执行文件内css名的替换
    .pipe(gulp.dest('dist/html'));										//- 替换后的文件输出的目录
    
    gulp.src(['rev/{css,img,js}/*.json', 'dist/css/**/*.css'])		
    .pipe(revCollector())                               
    .pipe(gulp.dest('dist/css'));	
    
    gulp.src(['rev/{css,img,js}/*.json', 'dist/js/**/*.js'])		
    .pipe(revCollector())                               
    .pipe(gulp.dest('dist/js'));	
    
});

gulp.task("autowatch",function(){
	gulp.watch(['src/sass/**/*.scss'],['sass']);		//监听sacc文件改变后，编译、去缓存
});


/*
 *	单步步骤：
 * 	1.gulp sass					编译scss文件
 * 	2.gulp jsmin				压缩js
 * 	3.gulp imgmin				压缩图片
 * 	4.gulp htmlmin				压缩HTML文件
 * 	5.gulp replaceURL			替换相对路径为绝对路径
 * 	6.gulp revUrl				引用manifest给HTML添加版本号
 * 	
 * 
 * 	gulp sass jsmin htmlmin imgmin replaceURL revUrl
 * 
 * 
 * 
 * 如果改了scss文件：则执行：gulp sass
 * 如果改了js文件：则执行：gulp jsmin
 * 如果改了img文件：则执行：gulp imgmin
 * 
 * 只要改了HTML引用到的资源文件，最后都需要执行gulp htmlmin,gulp replaceURL,gulp revUrl，以清理缓存
 * */
