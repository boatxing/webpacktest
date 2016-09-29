# webpacktest
webpack打包测试项目

webpack打包采用编程的思想，不像grunt一样使用配置的方式，更容易被开发人员接受。和模块化开发结合得很好，打包后可以完全抛弃seajs加载器。通过各种loader很好支持stylus、react、es6。
## loader是什么？
    将源文件转换为新的资源文件，例如将jsx编译为js文件，stylus文件编译为css文件
## plugin有什么用？
    对webpack增加额外的功能
## entry
    入口文件，和seajs的入口一样，这个js里面require的任何文件都会被打包到一个文件里面
## output
    定义输出的目录，文件名称
## module
    定义加载器
## plugins   
    插件
## 怎么分离出多个入口文件的公共模块
    - 一个项目会有多个入口文件，有一些公共模块会被多个入口依赖，如果每个入口都打包这些公共模块，会很浪费。
    - 一个入口文件依赖的模块很多，打包成一个js文件，文件很大，需要分多个文件打包

