<template>
    <div class="rectBox">
        <svg id="svg_rects" ref="svgRects" :style="{width:'100%',height:'100%'}">
            <g>
                <rect v-for="(value,index) in differentTypes" :key="index" 
                :style="{width:rectWidth+'px',height:getHeight(value.count),fill:index==getChooseTypeIndex?'red':'steelblue'}" 
                :x="padding.left+index*(rectWidth+gap)+'px'"
                :y="getY(value.count)" @click="rectClick(index)">
                </rect>
            </g>
        </svg>
    </div>
</template>
<script>
import {mapGetters,mapActions} from "vuex";
import * as d3 from "d3"
export default {
    name:'RectView',
    props:{'differentTypes':{default:''}},
    computed:{
        ...mapGetters(['getChooseTypeIndex','getDifferentTypes']),
        getHeight:function(){
            return function(count){
                let clientHeight=this.$refs.svgRects.clientHeight-this.padding.top-this.padding.bottom;
                return clientHeight/this.differentTypes[0].count*count+'px';
            }
        },
        getY:function(){
            return function(count){
                let clientHeight=this.$refs.svgRects.clientHeight;
                let height=(clientHeight-this.padding.top-this.padding.bottom)/this.differentTypes[0].count*count;
                return clientHeight-this.padding.bottom-height+'px';
            }
        }
    },
    data(){
        return {
            rectWidth:20,
            gap:2,
            padding:{
                left:35,
                right:10,
                top:20,
                bottom:20,
            },
            xScale:null,
            yScale:null,
            textX:"Types",
            textY:"Family Count",
        }
    },
    methods:{
        ...mapActions(["updateChooseTypeIndex","updateDifferentyTrees"]),
        rectClick(index){
            this.updateChooseTypeIndex(index);
        },
        drawAxis(){
            let height=this.$refs.svgRects.clientHeight;
            let width=this.$refs.svgRects.clientWidth;
            this.xScale=d3.scaleLinear().domain([0,parseInt((width-this.padding.right-this.padding.left)/(this.rectWidth+this.gap))])
            .range([this.padding.left,width-this.padding.right]);
            let count_max=d3.max(this.differentTypes,d=>d.count);
            this.yScale=d3.scaleLinear().domain([0,count_max])
            .range([height-this.padding.bottom,this.padding.top]);
            var xAxis=d3.axisBottom().scale(this.xScale);
            var xg=d3.select("#svg_rects").append("g").attr("transform",`translate(${-this.rectWidth/2-this.gap},${height-this.padding.bottom})`);
            xAxis(xg);
            var yAxis=d3.axisLeft().scale(this.yScale);
            var yg=d3.select("#svg_rects").append("g").attr("transform",`translate(${this.padding.left-this.rectWidth/2-this.gap},0)`);
            yAxis(yg);
            xg.append("text")
            .attr("transform",`translate(${width-this.padding.right-this.textX.length-5},${-this.padding.bottom/4*2})`)
            .attr("font-size",12)
            .attr("fill","#000")
            .text(this.textX)
            yg.append("text")
            .attr("transform",`translate(${this.padding.left*2},${this.padding.top/3*2})`)
            .attr("font-size",12)
            .attr("fill","#000")
            .text(this.textY)
        }
    },
    watch:{
        //选择的type发生改变
        //type树发生改变
        getChooseTypeIndex:function(){
            this.updateDifferentyTrees(this.getDifferentTypes[this.getChooseTypeIndex].name);
        },
        differentTypes:function(){
            this.drawAxis();
        }
    }
}
</script>
<style scoped>
.rectBox{
    width:100%;
    height:100%;
    overflow: auto hidden;
}
</style>