<template>
    <el-form :model="form" ref="form" :rules="rules" class="form">

        <el-form-item class="form-item" prop="username">
            <el-input 
            placeholder="用户名/手机" v-model="form.username">
            </el-input>
        </el-form-item>

        <el-form-item class="form-item" prop="password" >
            <el-input  placeholder="密码" type="password" v-model="form.password">
            </el-input>
        </el-form-item>

        <p class="form-text">
            <nuxt-link to="#">忘记密码</nuxt-link>
        </p>

        <el-button  class="submit"  type="primary" @click="handleLoginSubmit">登录</el-button>
    </el-form>

</template>

<script>
export default {
    data(){
        // 自定义表单规则
        let validateusername = (rule, value, callback) => {
            let usernameRule = /^1[3-9]\d{9}$/.test(value)
            if (!usernameRule) {
                return callback(new Error('手机号码格式不正确'))
            } else {
                callback()
            }
        }

        return {
            // 表单数据
            form: {
                username: '',
                password: ''
            },
            // 表单规则
            // validator为自定义规则
            rules: {
                username: [ { validator: validateusername, trigger: 'blur' } ],
                password: [ { required: true, message: '请输入密码', trigger: 'blur' } ]
            },
        }
    },
    methods: {
        // 提交登录
        handleLoginSubmit(){
        //    console.log(this.form)
           this.$refs.form.validate( (valid) => {
               // 如果通过了表单的验证规则，才提交登录
               if (valid) {
                    // this.$axios({
                    //     url: '/accounts/login',
                    //     method: 'POST',
                    //     data: this.form
                    // }).then((res) => {
                    //     console.log(res)
                    //     let data = res.data
                    //     // 通过commit调用store中的mutations方法把数据存到store中
                    //     this.$store.commit('user/setUserInfo', data)
                    //     // 用this.$store.state.user.userInfo的格式来获取store中的数据
                    //     // console.log(this.$store.state.user.userInfo.token)

                    // })

                    // 封装
                    // 通过dispatch调用action中的方法
                    this.$store.dispatch('user/login', this.form).then(() => {
                        this.$message({
                            message: '登录成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.$router.push('/')
                    })
               }
           })
           
        }
    }
}
</script>

<style scoped lang="less">
    .form{
        padding:25px;
    }

    .form-item{
        margin-bottom:20px;
    }

    .form-text{
        font-size:12px;
        color:#409EFF;
        text-align: right;
        line-height: 1;
    }

    .submit{
        width:100%;
        margin-top:10px;
    }
</style>