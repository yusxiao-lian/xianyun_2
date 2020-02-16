<template>
    <div class="main">
        <div class="air-column">
            <h2>乘机人</h2>
            <el-form class="member-info">
                <div class="member-info-item" 
                v-for="(item, index) in form.users"
                :key="index">
                    <el-form-item label="乘机人类型">
                        <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
                            <el-select 
                            slot="prepend" 
                            value="1" 
                            placeholder="请选择">
                                <el-option label="成人" value="1"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="证件类型">
                        <el-input 
                        placeholder="证件号码"  class="input-with-select" v-model="item.id">
                            <el-select 
                            slot="prepend" 
                            value="1"           
                            placeholder="请选择">
                                <el-option label="身份证" value="1" :checked="true"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <span class="delete-user" @click="handleDeleteUser(index)">-</span>
                </div>
            </el-form>

            <el-button class="add-member" type='primary' @click="handleAddUsers">添加乘机人</el-button>
        </div>

        <div class="air-column">
            <h2>保险</h2>
            <div>
                <div class="insurance-item" v-for="(item, index) in filghtInfo.insurances" :key="index">
                    <!-- change为选择时触发事件 -->
                    <el-checkbox 
                    :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}万`"
                    border @change="changeInsurance(item.id)">
                    </el-checkbox> 
                </div>
            </div>
        </div>

        <div class="air-column">
            <h2>联系人</h2>
            <div class="contact">
                <el-form label-width="60px">
                    <el-form-item label="姓名">
                        <el-input v-model="form.contactName"></el-input>
                    </el-form-item>

                    <el-form-item label="手机">
                        <el-input placeholder="请输入内容" v-model="form.contactPhone">
                            <template slot="append">
                            <el-button @click="handleSendCaptcha">发送验证码</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <!-- 计算属性 -->
                    <span>{{Totalprice}}</span>
                    <el-form-item label="验证码">
                        <el-input v-model="form.captcha"></el-input>
                    </el-form-item>
                </el-form>   
                <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // 收集订单信息
            form: {
                users: [
                    {
                        username: '',
                        id: ''
                    }
                ],
                insurances: [],  // 保险id
                contactName: '',
                contactPhone: '',
                captcha: '',
                invoice: false,   // 是否需要发票（Boolean)
                seat_xid: this.$route.query.seat_xid,  // 座位id
                air: this.$route.query.id        // 航班id
            },
            // 当前页面机票信息
            filghtInfo: {}
        }
    },
    methods: {
        // 添加乘机人
        handleAddUsers(){
            this.form.users.push({
                username: "",
                id: ""
            })
        },
        
        // 移除乘机人
        handleDeleteUser(index){
            this.form.users.splice(index, 1)
        },
        
        // 发送手机验证码
        handleSendCaptcha(){
            if (!this.form.contactPhone) {
                this.$message.error('请输入手机号')
                return;
            }
            this.$store.dispatch('user/getCaptcha', this.form.contactPhone).then((res) => {
                // console.log(res)
                this.$message.success(`验证码为： ${res.data.code}`)
            })
        },

        // 选择保险
        changeInsurance (id) {
            // 如果数组中已有此id则说明已经选择，则把它移除, 否则就加入数组
            if (this.form.insurances.indexOf(id) !== -1) {
                this.form.insurances.splice(this.form.insurances.indexOf(id), 1)
            } else {
                this.form.insurances.push(id)
            }
        },

        // 提交订单
        handleSubmit(){
            // 先验证表单内容
            // 自定义验证
            let rules = {
                //验证乘机人信息
                userInfo: {
                    // 错误信息
                    errorMessage: '请输入乘机人信息',
                    // 自定义验证函数,如果验证失败则返回false
                    validator: () => {
                        let valid = true;
                        this.form.users.forEach((item) => {
                            if (!item.username || !item.id) {
                                valid = false
                            }
                        })
                        return valid;
                    }
                },

                // 验证联系人姓名
                contactName: {
                    errorMessage: '请填写联系人姓名',
                    validator: () => {
                        return !!this.form.contactName
                    }
                },

                // 验证联系人手机号
                contactPhone: {
                    errorMessage: '请填写联系人号码',
                    validator: () => {
                        return !!this.form.contactPhone
                    }
                },

                // 验证验证码
                captcha: {
                    errorMessage: '请填写验证码',
                    validator: () => {
                        return !!this.form.captcha
                    }
                }
            }

            // 先设定一个状态
            let valid = true;
            // 运行自定义校验函数
            for (var i in rules) {
                valid = rules[i].validator();
                if (!valid) {
                    this.$message.error(rules[i].errorMessage)
                    return;
                }
            }
            // 如果验证不通过，则不发送请求
            if (!valid) {
                return
            }

            // 发送请求
            this.$axios({
                url: '/airorders',
                method: 'POST',
                data: this.form,
                // 设置请求头
                headers: {
                    // token前面加上`Bearer `，后面有一个空格的
                    Authorization: `Bearer ` + this.$store.state.user.userInfo.token
                }
            }).then((res) => {
                console.log(res)
            })
            // console.log(this.form)
        }
    },
    mounted () {
        // 获取机票信息
        let airsid = this.$route.query.id
        let seat_xid = this.$route.query.seat_xid
        this.$axios({
            url: `/airs/${airsid}`,
            params: {seat_xid}
        }).then((res) => {
            console.log(res.data)
            this.filghtInfo = res.data
            // 保存航班信息到store
            this.$store.commit("air/setOrderDetail", this.filghtInfo)
        })
    },
    computed: {
        // 计算机票总价
        Totalprice () {
            if (!this.filghtInfo.seat_infos) {
                return;
            }

            let Totalprice = 0;
            Totalprice = this.filghtInfo.seat_infos.org_settle_price;
            // 是否购买保险
            this.filghtInfo.insurances.forEach((item) => {
                if (this.form.insurances.indexOf(item.id) !== -1) {
                    Totalprice += item.price
                }
            })
            
            // 乘以人数
            Totalprice = Totalprice*this.form.users.length
            this.$store.commit("air/setTotalprice", Totalprice)
            return '';
        }
    }
}
</script>

<style scoped lang="less">
    .air-column{
        border-bottom:1px #ddd dashed;
        padding-bottom: 20px;   
        margin-bottom: 20px;
    }

    .air-column h2{
        margin-bottom: 20px;
        font-size: 22px;
        font-weight: normal;
    }

    /deep/ .el-select .el-input {
        width: 130px;
    }

    .input-with-select{
        width:590px;
    }

    .input-with-select /deep/  .el-input-group__prepend {
        background-color: #fff;
    }
    .member-info /deep/ .el-form-item{
        margin-bottom:0;
    }

    .member-info-item{
        border-bottom:1px #eee dashed;
        padding-bottom: 20px;
        position: relative;

        &:first-child{
            .delete-user{
                display: none;
            }
        }
    }

    .add-member{
        margin-top:20px;
    }

    .delete-user{
        display: block;
        background:#ddd;
        width:16px;
        height:16px;
        font-size:14px;
        text-align: center;
        line-height: 16px;
        color:#fff;
        cursor: pointer;
        border-radius: 50px;
        position:absolute;
        right:-30px;
        top:50%;
    }

    .insurance{
        > div{
            margin-top:10px;
        }
    }

    .insurance-item{
        margin-bottom: 20px;
    }

    .contact{
        /deep/ .el-input{
            width:50%;
        }
    }

    .submit{
        margin: 50px auto;
        display: block;
        width:250px;
        height:50px;
    }
</style>