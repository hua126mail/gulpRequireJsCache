# gulpRequireJsCache
使用gulp解决requireJs项目前端缓存问题

根据packjson文件，导入gulp依赖：npm install --save-dev

 *	单步步骤：
 * 	1.gulp sass					编译scss文件
 * 	2.gulp jsmin				压缩js
 * 	3.gulp imgmin				压缩图片
 * 	4.gulp htmlmin				压缩HTML文件
 * 	5.gulp replaceURL			替换相对路径为绝对路径
 * 	6.gulp revUrl				引用manifest给HTML添加版本号
