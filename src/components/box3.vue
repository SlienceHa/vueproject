<template>
    <div class="box3">
        <div id="treeMain"  style="width:50%;height:80%;margin:5px;"></div>
        <div id="treeSelectd" style="width:25%;height:40%;margin:5px;"></div>
    </div>
</template>

<script>
export default {
    name:'Tree',
    props:['svgId','getTree','getTree2'],
    data(){
        return{
            trees:[],
        }
    },
    methods:{
        area(){
            this.trees=require("../../static/att5.json");

            const pollen=['ageGap','averageAge','positionNum','timeSpan','villageNum']
            var x = this.trees[this.getTree.name]
            var y = this.trees[this.getTree2.name]
            if(x.ageGap<0)
                x.ageGap=0;
            if(y.ageGap<0)
                y.ageGap=0;
            let mainTree=[x.ageGap,x.averageAge,x.positionNum,x.timeSpan,x.villageNum]
            let similarTree=[y.ageGap,y.averageAge,y.positionNum,y.timeSpan,y.villageNum]
            let myChart = this.$echarts.init(document.getElementById('treeMain'));    
            let option = {
                legend: {
                    data: ['mainTree', 'similarTree']
                },
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: [
                        { name: 'ageGap', max: 50},
                        { name: 'averageAge', max: 150},
                        { name: 'positionNum', max: 10},
                        { name: 'timeSpan', max: 300},
                        { name: 'villageNum', max: 20},
                    ],
                    radius:'25%'
                },
                series: [{
                    name: '预算 vs 开销（Budget vs spending）',
                    type: 'radar',
                    // areaStyle: {normal: {}},
                    data: [
                        {
                            value: mainTree,
                            name: 'mainTree'
                        },
                        {
                            value: similarTree,
                            name: 'similarTree'
                        }
                    ]
                }]
            };
            myChart.setOption(option);

        }
    },
    watch:{
        getTree:function(){
            this.area();
        },
        getTree2:function(){
            this.area();
        },
        
    }
}
</script>


<style scoped>
.box3{
    width: 100%;
    height: 100%;
}

</style>