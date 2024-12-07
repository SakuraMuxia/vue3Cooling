// 动态使用import
const _import = (file: string) => {
    if (process.env.NODE_ENV === 'development') {
        return () => import(`../views/${file}.vue`);
    } else if (process.env.NODE_ENV === 'production') {
        return () => import(`../views/${file}.vue`);
    } else {
        throw new Error('未支持的 NODE_ENV 值');
    }
}

// 菜单转路由类型 方法
/**
 * 
 * @param menus 菜单列表
 * @return res 一个数组，数组中存放这路由配置对象
 */
export function ConvertToRoute(menus: any) {
    const res: any = []
    menus.forEach((menu: any) => {
        // 解构每个路由的配置项
        const { path, component, name, children, icon, hidden, redirect } = menu
        // 添加路由配置对象
        const route: any = {
            path,
            name,
            meta: {
                hidden: hidden === 0 ? false : true,
                title: name || '', // 设置标题
                icon: icon || '',  // 设置图标
            },
            redirect: redirect ? redirect : ''

        };
        // 添加路由配置对象 component属性
        if (component) {
            if (component === 'Layout') {
                route.component = () => import('@/layout/index.vue')
            } else {
                route.component = _import(component)
            }
        }
        // 递归处理子路由
        if (children && children.length > 0) {
            route.children = ConvertToRoute(children);
        }
        // 添加到结果数组
        res.push(route);
    });
    // 返回数组
    return res
}