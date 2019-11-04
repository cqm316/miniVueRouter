// 路由入口
let Vue;
class MRouter {
    static install(_Vue){
        // 别的地方要用到vue, 通过install会用到vue不需要import,import会让插件体积变大，没必要
        Vue = _Vue;
        Vue.mixin({
            beforeCreate() {
                // 启动路由
                if(this.$options.router){
                    // 这是入口
                    console.log(this.$options)
                    Vue.prototype.$mrouter = this.$options.router; // 路由挂载
                    this.$options.router.init();
                    // 有时候路由需要动态跳转
                    // this.$router.push('/about')
                }
            }
        })
    }
    constructor(options){
        this.$options = options;
        this.routeMap = {};
        // 使用Vue的响应式机制，路由切换的时候，做一些响应
        this.app = new Vue({
            data: {
                current: '/'
            }
        })
    }
    init(){
        // 启动整个路由
        // 由插件use负责启动就可以了
        // 1、监听hashchange事件
        this.bindEvents();
        // 2、处理路由表
        this.createRouteMap();
        // 3、初始化组件 router-view 和router-link
        this.initComponent();
        // 生命周期，路由守卫
    }
    initComponent(){
        // router-view
        Vue.component('router-link', {
            props: {
                to: String
            },
            render(h){
                // h三个参数
                // 组件名
                // 参数
                // 子元素
                return h('a',{
                    attrs:{
                        href:'#'+ this.to
                    }
                },[
                    this.$slots.default
                ])
            }
            // render
            // template: '<a :href="to"><slot>123</slot></a>' // 这一边多一次那个编译compile
        })
        const _this = this;
        Vue.component('router-view', {
            render(h) {
                let component = _this.routeMap[_this.app.current].component
                return h(component)
            }
        });
    }
    createRouteMap(){
        this.$options.routes.forEach(item=>{
            this.routeMap[item.path] = item
        })
    }
    bindEvents(){
        window.addEventListener('hashchange',this.onHashChange.bind(this),false)
        window.addEventListener('load', this.onHashChange.bind(this), false)
    }
    push(url){
         console.log(url)
         // hash 模式直接复制
         window.location.hash = url;
         // history模式 使用pushState
         // window.history.pushState(null,null,'#/'+url)
    }
    // 获取当前 hash 串
    getHash() {
        return window.location.hash.slice(1) || '/'
    }
    getFrom(e){
        let from, to;
        if(e.newURL) {
            from = e.oldURL.split('#')[1];
            to = e.newURL.split('#')[1];
        }else {
            // 这是一个第一次加载触发的
            from = '';
            to = this.getHash()
        }
        return {from, to}
    }
    onHashChange(e){
        // 获取当前的哈希值
        let hash = this.getHash();
        let router = this.routeMap[hash];
        let { from, to } = this.getFrom(e)
        // 修改this.app.current 值用了vue的响应式机制
        if(router.beforeEnter){
            // 有生命周期
            router.beforeEnter(from, to, () => {
                this.app.current = hash
            });
        }else {
            this.app.current = hash
        }
    }
}


export default MRouter