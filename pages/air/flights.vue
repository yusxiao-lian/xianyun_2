<template>
    <section class="contianer">
        <el-row  type="flex" justify="space-between">

            <!-- 顶部过滤列表 -->
            <div class="flights-content">
                <!-- 过滤条件 -->
                <FlightsFilters :data='cacheData' @getFilterData='getFilterData'></FlightsFilters>
                
                <!-- 航班头部布局 -->
                <FlightsListHead></FlightsListHead>
                
                <!-- 航班信息 -->
                <FlightsItem v-for="(item, index) in flightList" :key="index" 
                :data='item'></FlightsItem>

                <!-- // 分页 -->
                <!--current-change切换页面时触发  -->
                <!-- size-change切换每页多少条时触发 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[2, 4, 8, 16]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="flightsData.total">
                </el-pagination>
            </div>

            <!-- 侧边栏 -->
            <FlightsAside></FlightsAside>
        </el-row>
    </section>
</template>

<script>
import FlightsListHead from '@/components/air/flightsListHead'
import FlightsItem from "@/components/air/flightsItem.vue"
import FlightsFilters from "@/components/air/flightsFilters.vue"
import FlightsAside from "@/components/air/flightsAside.vue"
import moment from "moment";

export default {
    data(){
        return {
            flightsData: {
                info: {},
                flights: [],
                options: {}
            },
            // 当前页
            currentPage: 1,
            // 每页展示条数
            pagesize: 2,

            // 缓存数据备份
            cacheData: {
                info: {},
                flights: [],
                options: {}
            }
        }
    },
    components: { FlightsListHead, FlightsItem, FlightsFilters, FlightsAside },
    mounted () {
        // console.log(this.$route.query) // 获取地址栏参数
        // 获取航班所有信息
        this.getDataList()
    },
    methods: {
        // 切换每页多少条时触发
        handleSizeChange (value) {
            this.pagesize = value
        },

        // 切换页面时触发
        handleCurrentChange (value) {
            // 通过value能得到当前页码，用来计算分页数据
            // console.log(value)
            this.currentPage = value
        },

        // 筛选过滤数据
        getFilterData (value) {
            // console.log(value)
            this.flightsData.flights = value
            this.flightsData.total = value.length
        },

        // 封装获取数据列表
        getDataList () {
            // console.log(this.$route.query) // 获取地址栏参数
            this.$axios({
                url: '/airs',
                params: this.$route.query
            }).then((res) => {
                console.log(res)
                this.flightsData = res.data
                // 复制增加缓存数据,结构赋值
                this.cacheData = { ...res.data }
            })
        }
    },
    computed: {
        flightList () {
            if(!this.flightsData.flights){
                // 没有值就返回一个空数组
                return [];
            }
            // 1 0-4 2 4-8 3 8-12 4 12-16
            // slice(start, end)为从数组中选出开始到结束的数据的方法,不包括结束
            let List = this.flightsData.flights.slice((this.currentPage-1)*this.pagesize, this.currentPage*this.pagesize)
            return List
        }
    },
    // watch: {
    //     // 监听路由变化，发生变化则重新加载数据
    //     // watch可以监听实例下任何属性的变化
    //     $route () {
    //         // 重置页码为1
    //         this.currentPage = 1;
    //         // 重新加载数据
    //         this.getDataList()
    //     }
    // },

    // 当前页的导航守卫,当当前页面路由发生改变时执行
    // next 必须要调用
     beforeRouteUpdate (to, from, next) {
        // 重置页码为1
        this.currentPage = 1;
        // 请求机票列表数据
        this.getDataList()
        next();
    }
}
</script>

<style scoped lang="less">
    .contianer{
        width:1000px;
        margin:20px auto;
    }

    .flights-content{
        width:745px;
        font-size:14px;
    }

    .aside{
        width:240px;
    } 
</style>