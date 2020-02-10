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
            <nuxt-link to="/user/login">登录/注册</nuxt-link>
        </el-row>
    </el-row>

      
     
  </header>
</template>

<script>
export default {

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