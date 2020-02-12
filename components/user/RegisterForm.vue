<template>
    <el-form 
        :model="form" 
        ref="form" 
        :rules="rules" 
        class="form">
            <el-form-item class="form-item" prop="username">
                <el-input 
                placeholder="用户名手机" v-model="form.username">
                </el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="captcha">
                <el-input 
                placeholder="验证码" v-model="form.captcha">
                    <template slot="append">
                        <el-button @click="handleSendCaptcha">
                            发送验证码
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="nickname">
                <el-input 
                placeholder="你的名字" v-model="form.nickname">
                </el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="password">
                <el-input 
                placeholder="密码" 
                type="password"
                v-model="form.password"
                ></el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="checkpassword">
                <el-input 
                placeholder="确认密码" 
                type="password"
                v-model="form.checkpassword">
                </el-input>
            </el-form-item>

            <el-button 
            class="submit" 
            type="primary" 
            @click="handleRegSubmit">
                注册
            </el-button>
        </el-form>
</template>

<script>
export default {
    data(){
        // 自定义表单规则
        let validateusername = (rule, value, callback) => {
            if (!value) {
                return;
            }
            let usernameRule = /^1[3-9]\d{9}$/.test(value)
            if (!usernameRule) {
                return callback(new Error('手机号码格式不正确'))
            } else {
                callback()
            }
        }
        // 验证第二次密码
        let validateCheckpassword = (rule, value, callback) => {
           if (value === '') {
               return callback(new Error('请输入确认密码'))
           } else if (value !== this.form.password) {
               return callback(new Error('两次输入的密码不一致'))
           } else {
               callback()
           }
        }

        return {
            // 表单数据
            form: {
                username: '',
                nickname: '',
                captcha: '',
                password: '',
                checkpassword: ''
            },
            // 表单规则
            rules: {
                username: [{ validator: validateusername, trigger: 'blur' }],
                nickname: [{  required: true, message: '请输入名字', trigger: 'blur' }],
                captcha: [{  required: true, message: '请输入验证码', trigger: 'blur' }],
                password: [{  required: true, message: '请输入密码', trigger: 'blur' }],
                checkpassword: [{ validator: validateCheckpassword, trigger: 'blur' }]
            },
        }
    },
    methods: {
        // 发送验证码
        handleSendCaptcha(){
            let usernameRule = /^1[3-9]\d{9}$/.test(this.form.username)
            if (!usernameRule) {
                return;
            }
            // this.$axios({
            //     url: '/captchas',
            //     method: 'POST',
            //     data: {
            //         tel: this.form.username
            //     }
            // }).then((res) => {
            //     console.log(res)
            // })

            // 封装到store以便复用
            this.$store.dispatch('user/getCaptcha', this.form.username).then((res) => {
                // console.log(res)
                this.$message.success('手机验证码为：' + res.data.code)
            })
        },


        // 注册
        handleRegSubmit(){
        //    console.log(this.form)
            this.$refs.form.validate( (valid) => {
                if (valid) {
                    // 解构，data值为除去checkpassword后剩余的数据
                    let { checkpassword, ...data } = this.form
                    // console.log(data)
                    this.$store.dispatch('user/register', data).then((res) => {
                        // console.log(res)
                        this.$message.success('注册成功')
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