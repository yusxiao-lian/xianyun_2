<template>
    <div class="search-form">

        <!-- 头部tab切换 -->
        <el-row type="flex" class="search-tab">
            <span v-for="(item, index) in tabs" :key="index"
            @click="handleSearchTab(item, index)"
            :class="{active: index === currentTab}">
                <i :class="item.icon"></i>{{item.name}}
            </span>
        </el-row>

        <el-form class="search-form-content" ref="form" label-width="80px">
            <el-form-item label="出发城市" prop="departCity">
                <!-- fetch-suggestions 返回输入建议的方法,监听输入框的输入，可以在这个事件中请求API数据,类似input事件 -->
                <!-- select 点击选中建议项时触发,点击展开列表选项时候触发 -->
                <el-autocomplete
                :fetch-suggestions="queryDepartSearch"
                placeholder="请搜索出发城市"
                @select="handleDepartSelect"
                class="el-autocomplete"
                v-model="form.departCity"
                @blur="handleDepartCityBlur"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="到达城市" prop="destCity">
                <el-autocomplete
                :fetch-suggestions="queryDestSearch"
                placeholder="请搜索到达城市"
                @select="handleDestSelect"
                class="el-autocomplete"
                v-model="form.destCity"
                @blur="handleDestcityBlur"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="出发时间">
                <!-- change 用户确认选择日期时触发 -->
                <el-date-picker type="date" 
                placeholder="请选择日期" 
                style="width: 100%;"
                @change="handleDate"
                v-model="form.departDate"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="">
                <el-button style="width:100%;" 
                type="primary" 
                icon="el-icon-search"
                @click="handleSubmit"
               >
                    搜索
                </el-button>
            </el-form-item>
            <div class="reverse">
                <span @click="handleReverse">换</span>
            </div>
        </el-form>  
      </div>
</template>

<script>
// 时间格式转换包
import moment from "moment";
export default {
    data(){
        return {
            tabs: [
                {icon: "iconfont icondancheng", name: "单程"},
                {icon: "iconfont iconshuangxiang", name: "往返"}
            ],
            currentTab: 0,
            // 城市机票
            form: {
                departCity: "",
                departCode: "",
                destCity: "",
                destCode: "",
                departDate: ""
            },
            // 模糊搜索数据合集
            departCitys: [],
            destCitys: [],

            // 日期配置
            pickerOptions: {
                // true为可选日期
                disabledDate(time) {
                    return time.getTime() + 3600 * 1000 * 24 < Date.now();
                }
            }
        }
    },
    methods: {
        // tab切换时触发
        handleSearchTab(item, index){
            this.$alert('暂不支持往返机票，请选择单程票', '温馨提示', {
                confirmButtonText: '确定'
            })
        },
        
        // 出发城市输入框获得焦点时触发
        // value 是选中的值，cb是回调函数，接收要展示的列表
        queryDepartSearch(value, cb){
            if (!value) {
                // 如果没输入值时则不出先空选项
                this.departCitys = []
                cb([])
                return;
            }
            // value为input框输入的值
            // console.log(value)
            this.$axios({
                url: '/airs/city',
                params: {
                    name: value
                }
            }).then((res) => {
                // console.log(res)
                this.departCitys = res.data.data
                this.departCitys = this.departCitys.map(item => {
                    item.value = item.name.replace('市', '')
                    return item
                })
                cb(this.departCitys);
                // console.log(this.departCitys)
            })     
        },

        // 目标城市输入框获得焦点时触发
        // value 是选中的值，cb是回调函数，接收要展示的列表
        queryDestSearch(value, cb){
            if (!value) {
                 // 如果没输入值时则不出先空选项
                this.destCitys = []
                cb([])
                return;
            }
           this.$axios({
                url: '/airs/city',
                params: {
                    name: value
                }
            }).then((res) => {
                this.destCitys = res.data.data
                this.destCitys = this.destCitys.map(item => {
                    item.value = item.name.replace('市', '')
                    return item
                })
                cb(this.destCitys);
            })
            // cb([
            //     {value: 1},
            //     {value: 2},
            //     {value: 3},
            // ]);
        },
       
        // 出发城市下拉选择时触发
        handleDepartSelect(item) {
            // console.log(item)
            this.form.departCity = item.value
            this.form.departCode = item.sort
        },

        // 目标城市下拉选择时触发
        handleDestSelect(item) {
            this.form.destCity = item.value
            this.form.destCode = item.sort
        },

        // 确认选择日期时触发
        handleDate(value){
            // 直接使用时间插件中的属性修改时间格式也行
            //  this.form.departDate = moment(value).format("YYYY-MM-DD");
        },

        // 触发和目标城市切换时触发
        handleReverse(){
            let { departCity, departCode, destCity, destCode } = this.form
            this.form.departCity = destCity
            this.form.departCode = destCode
            this.form.destCity = departCity
            this.form.destCode = departCode
        },

        // 如果用户不选择则默认再失焦时选第一个数据
        // 出发城市
        handleDepartCityBlur () {
            if (this.departCitys.length === 0) {
                return;
            }
            // 防空字段撤回取值
            if (this.form.departCity === '') {
                this.departCitys = []
            }

            if (this.departCitys.length !== 0) {
                this.form.departCity = this.departCitys[0].value
                this.form.departCode = this.departCitys[0].sort
            }
        },

        // 目标城市
        handleDestcityBlur () {
            if (this.destCitys.length === 0) {
                return;
            }
            // 防空字段撤回取值
            if (this.form.destCity === '') {
                this.destCitys = []
            }
            if (this.destCitys.length !== 0) {
                this.form.destCity = this.destCitys[0].value
                this.form.destCode = this.destCitys[0].sort
            }
        },

        // 提交表单是触发
        handleSubmit(){
            // 验证字段是否为空
            if(!this.form.departCity){
                this.$message.error("请输入出发城市");
                return;
            }

            if(!this.form.destCity){
                this.$message.error("请输入到达城市");
                return;
            }

            if(!this.form.departDate){
                this.$message.error("请选择时间");
                return;
            }
           console.log(this.form)
           this.$router.push({
               path: "/air/flights",
               query: this.form
           })
        }
    },
    mounted() {
       
    }
}
</script>

<style scoped lang="less">
.search-form{
    border:1px #ddd solid;
    border-top:none;
    width:360px;
    height:350px;
    box-sizing: border-box;
}

.search-tab{
  span{
    display: block;
    flex:1;
    text-align: center;
    height:48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top:3px #eee solid;
    background:#eee;
  }

  .active{
    border-top-color: orange;
    background:#fff;
  }

  i{
    margin-right:5px;
    font-size: 18px;

    &:first-child{
      font-size:16px;
    }
  }
}

.search-form-content{
  padding:15px 50px 15px 15px;
  position: relative;

  .el-autocomplete{
    width: 100%;
  }
}

.reverse{
  position:absolute;
  top: 35px;
  right:15px;

  &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:-35px;
      width:25px;
      height:1px;
      background:#ccc;
  }

  &:after{
      top:0;
    }

    &:before{
      top:60px;
    }

  span{
    display: block;
    position:absolute;
    top: 20px;
    right:0;
    font-size:12px;
    background: #999;
    color:#fff;
    width:20px;
    height:20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:10px;
      width:1px;
      height:20px;
      background:#ccc;
    }

    &:after{
      top:-20px;
    }

    &:before{
      top:20px;
    }
  }
}
</style>