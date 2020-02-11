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
};

// 固定的属性，异步修改state中的值的方法，一般存放接口的请求的
export const actions = {};