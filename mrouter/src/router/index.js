import Vue from 'vue'
// import VueRouter from 'vue-router'
import MRouter from '../mrouter'
import Home from '../views/Home.vue'
//  实际执行的是install方法
Vue.use(MRouter);

// 路由基本配置
export default new MRouter({
    routes:[
        {
            path: '/',
            name: 'home',
            component: Home,
            beforeEnter(from, to, next){
                // next执行才跳转
                console.log(`beforeEnter from ${from} to ${to}`)
                // 模拟异步
                setTimeout(()=>{
                    // 2秒之后再跳转
                    // 做任何权限认证的事情
                    next();
                },1000)
            }
        },
        {
            path: '/about',
            name: 'about',
            component:() => import('../views/About.vue')
        }
    ]
});

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: Home
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
//   }
// ]
//
// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })
//
// export default router
