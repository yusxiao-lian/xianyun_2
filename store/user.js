// 用户数据管理
// 固定的属性，必须要export暴露出去的
export const state = () => ({
    // 采用接口返回的数据结构
    userInfo: {
        token: "",
        user: {},
    },
}) 

// 固定的属性，同步修改state中的值
export const mutations = {
    // 方法的第一个参数必须是state,第二个为传入的值
    setUserInfo (state, data) {
        state.userInfo = data
    }
}

// 固定的属性，异步修改state中的值的方法，一般存放接口的请求的
export const actions = {
    // 登录
    // 第一个参数必须是store
    login (store, data) {
        return this.$axios({
            url: '/accounts/login',
            method: 'POST',
            data: data
        }).then((res) => {
           let data = res.data
           store.commit('setUserInfo', data)
        })
    },

    // 获取验证码
    getCaptcha (store, tel) {
        return this.$axios({
            url: '/captchas',
            method: 'POST',
            data: {
                tel: tel
            }
        }).then((res) => {
            return res;
        })
    },

    // 注册
    register (store, data) {
        return this.$axios({
            url: '/accounts/register',
            method: 'POST',
            data
        }).then((res) => {
            // 注册成功后把值存到store，然后登录跳转到首页
            let { data } =res
            store.commit('setUserInfo', res.data)
            return res;
        })
    }
}