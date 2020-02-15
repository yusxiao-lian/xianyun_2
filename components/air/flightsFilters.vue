<template>
    <div class="filters">
        <el-row type="flex" class="filters-top" justify="space-between" align="middle">
            <el-col :span="8">
                单程： 
                {{data.info.departCity}} - {{data.info.destCity}}
                / 
                {{data.info.departDate}}
            </el-col>
            <el-col :span="4">
                <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
                    <el-option
                    v-for="(item, index) in data.options.airport" :key="index"
                    :label="item"
                    :value="item"
                    >
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select size="mini" v-model="flightTimes"  placeholder="起飞时间" @change="handleFlightTimes">
                    <el-option
                    v-for="(item, index) in data.options.flightTimes" :key="index"
                    :label="`${item.from}:00 - ${item.to}:00`"
                    :value="`${item.from}:${item.to}`"
                    >
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select size="mini" v-model="company"  placeholder="航空公司" @change="handleCompany">
                    <el-option
                    v-for="(item, index) in data.options.company" :key="index"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
                    <el-option
                    v-for="(item, index) in airSizeList" :key="index"
                    :label="item.size"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <!-- 调用计算属性 -->
        <span>{{flights}}</span>
        <div class="filter-cancel">
            筛选：
            <el-button 
                       type="primary" 
                       round 
                       plain 
                       size="mini" 
                       @click="handleFiltersCancel">
                撤销
    		</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            // 进行筛选的数据
            airport: "",        // 机场
            flightTimes: "",    // 出发时间
            company: "",        // 航空公司
            airSize: "",        // 机型大小

            // 机型的选择数据
            airSizeList: [
                { size: "大", value: "L" },
                { size: "中", value: "M" },
                { size: "小", value: "S" }
            ]
        }
    },
    props: {
        data: {
            type: Object,
            default: {}
        }
    },
    methods: {
        // 选择出发机场时候触发
        handleAirport(value){
            // let filterdata = this.data.flights.filter((val) => {
            //     return val.org_airport_name === value
            // })
            // this.$emit('getFilterData', filterdata)
        },

        // 选择出发时间时候触发
        handleFlightTimes(value){
            // // console.log(value)
            // let filterdata = this.data.flights.filter((val) => {
            //     let deptime = val.dep_time.split(':')
            //     let selecttime = value.split(':')
            //     return (+selecttime[0] <= +deptime[0] && +deptime[0] < +selecttime[1]);
            // })
            // this.$emit('getFilterData', filterdata)
        },

         // 选择航空公司时候触发
        handleCompany(value){
            // // console.log(value)
            // // 筛选数据
            // let filterdata = this.data.flights.filter((val) => {
            //     return val.airline_name === value
            // })
            // this.$emit('getFilterData', filterdata)

        },

         // 选择机型时候触发
        handleAirSize(value){
        //    let filterdata = this.data.flights.filter((val) => {
        //        return val.plane_size === value
        //    })
        //    this.$emit('getFilterData', filterdata)
        },
        
        // 撤销条件时候触发
        handleFiltersCancel(){
            
        },
    },
    // 通过计算属性实现多项筛选
    computed: {
        flights () {
            let arr = this.data.flights.filter((item) => {
                // retrun出true的数据,过滤false的数据,满足条件为false则把这条数据返回给新数组
                // 先设置一个状态
                let status = true
                // 筛选出不符合要求的航班机型
                if (this.airSize && item.plane_size !== this.airSize) {
                    status = false
                }
                // 筛选航空公司
                if (this.company && item.airline_name !== this.company) {
                    status = false
                }
                // 筛选机场
                if (this.airport && item.org_airport_name !== this.airport) {
                    status = false
                }
                // 筛选时间
                if (this.flightTimes) {
                    // 出发时间
                    let deptime = item.dep_time.split(':')
                    // 所选时间
                    let selecttime = this.flightTimes.split(':')
                    if (+deptime[0] < +selecttime[0] || +deptime[0] > +selecttime[1]) {
                        status = false
                    }
                }
                // retrun出true的数据,过滤false的数据,满足条件为true则把这条数据返回给新数组
                return status;
            })
            // 传递参数
            this.$emit('getFilterData', arr)
            // return空是为了调用而不渲染数据
            return '';
        }
    }

}
</script>

<style scoped lang="less">
    .filters{
        margin-bottom:20px;
    }

    .filters-top{
        > div{
            /deep/ .el-select{
                margin-left:10px;
            }
        }
    }

    .filter-cancel{
        margin-top:10px;
    }
</style>