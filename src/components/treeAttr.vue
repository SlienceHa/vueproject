<template>
  <div class="Attr_box">
      <div id="attr" ref="attr" style="width:100%;height:100%"></div>
  </div>

</template>

<script>
import * as d3 from 'd3';
import echarts from 'echarts'
import { mapGetters, mapActions } from 'vuex';
export default {
    props:['getTree','svgId'],
    data(){
        return{
            trees:[],
        }
    },
     computed:{
        ...mapGetters(['getChoosedTrees','getSelectedTree']),
      
    },
    methods:{   
        ...mapActions(['updateTree2']),
        changesim(name){
            this.updateTree2(name);
        },
         compare(a,b){
            if(a>b)
                return b/a/5*100;
            else
                return a/b/5*100;
        },
        render(){
            this.trees=require("../../static/att5.json");
            //主树规定
            const mainTree = this.trees[this.getTree.name];
            console.log(mainTree);
            //待选树规定（暂且默认为前50棵拓扑结构相似的树）
            var selectedTree = [];
            this.getChoosedTrees.forEach(element => {
                this.trees[element.name].name = element.name;
                selectedTree.push(this.trees[element.name])
            });
            console.log(selectedTree);
            if(this.getSelectedTree!=[]){
                selectedTree=this.getSelectedTree;
            }
            //主树与待选树进行一个属性比较，计算属性相似性并进行排序
            let compareTreeList = []
            selectedTree.forEach(element=>{
                //计算相似程度
                let temp={}
                let ageGap_value = this.compare(Math.abs(element.ageGap),Math.abs(mainTree.ageGap))
                let averageAge_value = this.compare(Math.abs(element.averageAge),Math.abs(mainTree.averageAge))
                let positionNum_value = this.compare(Math.abs(element.positionNum),Math.abs(mainTree.positionNum))
                let timeSpan_value = this.compare(Math.abs(element.timeSpan),Math.abs(mainTree.timeSpan))
                let villageNum_value = this.compare(Math.abs(element.villageNum),Math.abs(mainTree.villageNum))
                temp.name=element.name;
                temp.data=[ageGap_value,averageAge_value,positionNum_value,timeSpan_value,villageNum_value];
                temp.sim = ageGap_value+averageAge_value+positionNum_value+timeSpan_value+villageNum_value;
                compareTreeList.push(temp);
            })
            compareTreeList = compareTreeList.sort((a,b)=>{return a['sim'] - b['sim']})
            console.log(compareTreeList); 
            //构造图表
            let myCharts = this.$echarts.init(document.getElementById('attr'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['ageGap', 'averageAge', 'positionNum', 'timeSpan', 'villageNum']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: compareTreeList.map((d)=>{return d.name})
                },
                dataZoom: [{
                    type: 'slider',
                    show: true,
                    yAxisIndex: [0],
                    left: '9%',
                    bottom: 0,
                    start:40,
                    end: 10 //初始化滚动条
                }],
                series: [
                    {
                        name: 'ageGap',
                        type: 'bar',
                        stack: '总量',
                        data: compareTreeList.map((d)=>{return d.data[0]})
                    },
                    {
                        name: 'averageAge',
                        type: 'bar',
                        stack: '总量',
                        data: compareTreeList.map((d)=>{return d.data[1]})
                    },
                    {
                        name: 'positionNum',
                        type: 'bar',
                        stack: '总量',
                        data:compareTreeList.map((d)=>{return d.data[2]})
                    },
                    {
                        name: 'timeSpan',
                        type: 'bar',
                        stack: '总量',
                        data: compareTreeList.map((d)=>{return d.data[3]})
                    },
                    {
                        name: 'villageNum',
                        type: 'bar',
                        stack: '总量',
                        data: compareTreeList.map((d)=>{return d.data[4]})
                    }
                ]
            };
            myCharts.setOption(option);
            myCharts.on('click',function(params){
                render();
            });
        },
       




    },
    mounted(){
        this.render();
    },
    watch:{
        getTree:function(){
            this.render();
        },
        getChoosedTrees:function(){
            this.render();
        },
        getSelectedTree:function(){
            this.render();
        }
    }
}
</script>




<style scoped>
.Attr_box{
    width: 100%;
    height: 100%;
    float:right;
}


</style>>
