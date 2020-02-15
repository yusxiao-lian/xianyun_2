export const state = () => {
    return {
        // 搜索历史列表数据
        historyList: []
    }
}

export const mutations = {
    setHistorySearch (state, data) {
        // 限制展示数量
        if (state.historyList.length >=  6) {
            state.historyList.splice(5)
            state.historyList.unshift(data)
        } else {
            state.historyList.unshift(data)
        }
        
    }
}