export const state = () => {
    return {
        // 搜索历史列表数据
        historyList: [],

        // 航班信息
        orderDetail: {
            // 数据返回前防止报错
            seat_infos: {
                org_settle_price: ''
            }
        },

        // 机票总价
        Totalprice: ''
    }
}

export const mutations = {
    // 存储搜索历史
    setHistorySearch (state, data) {
        // 限制展示数量
        if (state.historyList.length >=  6) {
            state.historyList.splice(5)
            state.historyList.unshift(data)
        } else {
            state.historyList.unshift(data)
        }
        
    },

    // 存储航班信息
    setOrderDetail (state, data) {
        state.orderDetail = data
    },
    // 存储机票总价
    setTotalprice (state, data) {
        state.Totalprice = data
    }
}