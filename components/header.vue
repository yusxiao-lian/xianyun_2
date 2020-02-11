<template>
  <header class="header">
      
    <el-row type="flex" class="main" justify="space-between" align="middle">
        <!-- logo -->
        <nuxt-link to="/">
            <img src="/logo.jpg" alt="图片加载失败">
        </nuxt-link>

        <!-- nav -->
        <el-row type="flex" class="nav">
            <nuxt-link to="/">首页</nuxt-link>
            <nuxt-link to="/post">旅游攻略</nuxt-link>
            <nuxt-link to="/hotel">酒店</nuxt-link>
            <nuxt-link to="/air">国内机票</nuxt-link>
        </el-row>

        <!-- login -->
        <el-row>
           <!-- 如果用户存在则展示用户信息，用户数据来自store -->
                <el-dropdown v-if="$store.state.user.userInfo.token">
                    <el-row type="flex" align="middle" class="el-dropdown-link">
                        <nuxt-link to="#">
                            <img :src="$axios.defaults.baseURL + $store.state.user.userInfo.user.defaultAvatar"/>
                            {{$store.state.user.userInfo.user.nickname}}
                        </nuxt-link>
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                    </el-row>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                           <nuxt-link to="#">个人中心</nuxt-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <div @click="handleLogout">退出</div> 
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

            <!-- 如果用户还未登录 -->
            <nuxt-link to="/user/login" v-else>登录/注册</nuxt-link>
        </el-row>
    </el-row>

      
     
  </header>
</template>

<script>
export default {
    methods: {
        handleLogout () {
            console.log(11)
        }
    }
}
</script>

<style lang="less" scoped>
.header {
    background: white;
    background: #fff;
    border-bottom: 1px solid #ccc;
    box-shadow: 0 3px 3px #f6f6f6;
    min-width: 1000px;
    .main {
        width: 1000px;
        margin: 0 auto;
        height: 60px;

        img {
            height: 42px;
        }

        .nav {
            flex: 1;
            margin-left: 20px;
            a {
                padding: 0 20px;
                box-sizing: border-box;
                height: 60px;
                line-height: 60px;
                &:hover {
                    border-bottom: 5px solid #409eff;
                    color: #409eff;
                } 
            }
            .nuxt-link-exact-active {
                background: #409eff;
                color: #fff;
                &:hover{
                    color: #fff;
                }
            }
        }
    }
}

</style>