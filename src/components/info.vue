<template>
    <div class="infoBox">
        <div id="parallel" style=" height: 100%;width: 100%"></div>
    </div>
</template>
<script>
import * as d3 from 'd3';
import echarts from 'echarts'
import { mapGetters } from 'vuex';
export default {
    data(){
        return{
            trees:[],
        }
    },
    computed:{
        ...mapGetters(['getSelectedTree1','getChangeState'])
    },
    methods:{
        render(){
            this.trees=require("../../static/att5.json");
            const pollen=[];
            for(let i = 0;i<this.getSelectedTree1.length;i++){
                let x = this.trees[this.getSelectedTree1[i].name];
                if(x.ageGap<0){
                    x.ageGap=0;
                }
                let temp=[x.ageGap,x.averageAge,x.positionNum,x.timeSpan,x.villageNum,this.getSelectedTree1[i].state];
                pollen.push(temp);
                // console.log(pollen);
            }
            // console.log(pollen);
            // console.log("1");

            let myChart = this.$echarts.init(document.getElementById('parallel'));
            let option = {
                parallelAxis: [
                    {dim: 0, name: 'ageGap'},
                    {dim: 1, name: 'averageAge'},
                    {dim: 2, name: 'positionNum'},
                    {dim: 3, name: 'timeSpan'},
                    {dim: 4, name: 'villageNum'},
                ],
                series: {
                    type: 'parallel',
                    lineStyle: {
                        width: 1,
                        color: function(d){ return pollen[d.dataIndex][5]==0?'rgba(106,90,205,0.2)':'red'}
                    },
                    data: pollen
                }
            };
            myChart.setOption(option);
        }
    },
    mounted(){
        this.render();
    },
    watch:{
        getSelectedTree1:function(){
            this.render();
        },
        getChangeState:function(){
            this.render();
        }
    }
}
</script>



<style scoped>
.infoBox{
    width: 100%;
    height: 100%;
}
</style>