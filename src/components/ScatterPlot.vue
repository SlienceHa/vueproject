<template>
    <div style="width:100%;height:100%">
        <select style="position:absolute;left:1.8%;top:3.5%" v-model="textY" @change="changeY()">
           <option v-for="item in attrY" :key="item" :value="item">{{item}}</option>
        </select>
    <svg style="width:100%;height:95%" ref="scatterSvg" id="scatterSvg">
        <g>
            <circle v-for="value in trees"  :key="value.name" :r="3" :cx="getX(value[textX])"
                :cy="getY(value[textY])" :style="{stroke:'#ccc',strokeWidth:0.5,fillOpacity:0.7}"
                @click="circleClick(value.name)"
             >
            </circle>
        </g>
    </svg>
          <select style="position:absolute;left:14.8%;top:23%" v-model="textX" @change="changeX()">
               <option v-for="item in attrX" :key="item" :value="item">{{item}}</option>
        </select>
    </div>
</template>

<script>
import * as d3 from 'd3'
import * as d3Color from 'd3-scale-chromatic'
import {mapActions} from 'vuex'
export default {
    name:'ScatterPlot',
    data(){
        return {
            attr:['Number','ageGap','averageAge','positionNum','timeSpan','villageNum','depth'],
            attrY:['Number','ageGap','averageAge','positionNum','timeSpan','villageNum','depth'],
            attrX:['Number','ageGap','averageAge','positionNum','timeSpan','villageNum','depth'],
            padding:{
                top:10,
                left:30,
                right:20,
                bottom:50,
            },
            minRadius:2,
            maxRadius:7,
            maxDeepth:0,
            maxCount:0,
            xScale:null,    //x比例尺
            yScale:null,    //y比例尺
            sScale:null,    //大小比例尺，
            cScale:null,    //颜色比例尺
            width:0,
            height:0,
            avAge:0,
            years:0,
            textX:'Number',
            textY:'ageGap',
        }
    },
    props:['trees'],
    computed:{
       getX:function(){
            return function(years){
                return this.xScale(years);
            }
        },
        getY:function(){
            return function(avAge){
                // console.log(count)
                return this.yScale(avAge);
            }
        },
        getFill:function(){
            return function(cluster){
                
                if(cluster>=12||cluster<0){
                    return '#fff';
                }
                else{
                    return d3Color.schemePaired[cluster];
                }
            }
        },
        getSize:function(){
            return function(count){
                return this.sScale(count);
            }
        }
    },
    methods:{
        ...mapActions(['fetchTree']),
        changeY(){
            this.attrX=[];
            this.attr.forEach((ele)=>{
                if(ele!=this.textY)
                    this.attrX.push(ele)
            })
            this.changeAll();
        },
        changeX(){
            this.attrY=[];
            this.attr.forEach((ele)=>{
                if(ele!=this.textX)
                    this.attrY.push(ele)
            })
            this.changeAll();
        },
        drawAxis(){
            d3.selectAll('.axis').remove();
            var xAxis=d3.axisBottom().scale(this.xScale);
            var xg=d3.select("#scatterSvg").append("g").attr("class","axis").attr("transform",`translate(0,${this.height-this.padding.bottom})`);
            xAxis(xg);
            var yAxis=d3.axisLeft().scale(this.yScale);
            var yg=d3.select("#scatterSvg").append("g").attr("class","axis").attr("transform",`translate(${this.padding.left},0)`);
            yAxis(yg);
            // xg.append("text")
            // .attr("transform",`translate(${this.width-this.padding.right-this.textX.length-5},${this.padding.bottom/4*3})`)
            // .attr("font-size",12)
            // .attr("fill","#000")
            // .text(this.textX)
            // yg.append("text")
            // .attr("transform",`translate(${this.padding.left*2},${this.padding.top/3*2})`)
            // .attr("font-size",12)
            // .attr("fill","#000")
            // .text(this.textY)
        },
        circleClick(name){
            this.fetchTree(name);
        },
        changeAll(){
            const x = d3.max(this.trees,d=>d[this.textX]);
            const y = d3.max(this.trees,d=>d[this.textY]);
            this.maxCount=d3.max(this.trees,d=>d.Number);
            // this.avAge=d3.max(this.trees,d=>d.averageAge);
            this.width=this.$refs.scatterSvg.clientWidth;
            this.height=this.$refs.scatterSvg.clientHeight;
            this.xScale=d3.scaleLinear().domain([0,x])
            .range([this.padding.left,this.width-this.padding.right]);
            this.yScale=d3.scaleLinear().domain([0,y])
            .range([this.height-this.padding.bottom,this.padding.top]);
            this.drawAxis();
            this.sScale=d3.scaleLinear().domain([0,this.maxCount])
            .range([this.minRadius,this.maxRadius]);
            // this.cScale=d3.scaleLinear().domain([0,this.maxDeepth])
            // .range([0,1]);
        }
    },
    watch:{
        trees(){
            this.changeAll();
        },
    }
}

</script>

<style scoped>

</style>
