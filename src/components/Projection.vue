<template>
    <div class="projectionBox" >
        <select style="position:absolute;top:-23px;left:865px"  v-model="state">
            <option v-for="item in showState" :key="item" :value="item">{{item}}</option>
        </select>
        <button style="position:absolute;top:-23px;left:790px;width:72px;height:20px;" @click="getRepresentTree()">{{this.showTreeState==0?'ShowTree':'HideTree'}}</button>
        <div  v-for="(value,index) in this.PresentTree" :key="value.name" :style="{width:'150px',height:'100px',position:'absolute',left:value.x+'px',top:value.y+'px'}">
             <ModelTree :indexx="index+1000" :tree="value" />
        </div>
       <!-- <pig v-for="value in 12" :key="value" :tree=getPig(value-1)  :trees="getTrees" :padding="{top:30,left:20,}" :loc=getLoc(value)></pig> -->
        <svg id="svg_pro" ref="svgPro" v-on:mousedown="startDraw"  @mousewheel="zooming()">
            <g>
                <circle v-for="(value,index) in location" :key="index" :cx="value.x+'px'" :cy="value.y+'px'" :r="radius_ori" :id="'circle_'+value.id" class="circle"
                :style="{fillOpacity:1,stroke:'#000',strokeWidth:.5,fill: getFill(value.cluster)}" @click="displayTree(value)">
                </circle>
            </g>
            <!-- <g>
                <circle v-for="(item,key) in getClusters" :key="key" :cx="Object.keys(locationDic)==0?0:getClustersX(item)" :cy="Object.keys(locationDic)==0?0:getClustersY(item)" :r="Object.keys(locationDic)==0?0:getClustersR(item)"
                :style="{fill:'white',stroke:'black',strokeWidth:'1px',fillOpacity:key=='-1'?0:0.5,strokeOpacity:key=='-1'?0:1}">
                </circle>
            </g> -->
            <!-- 颜色块 -->
            <g v-show="state=='DBscan'">
                <rect v-for="value in 12" :key="value" width="15px" height="15px" :x="15+(value-1)*17" :y="height-20" 
                :stroke="(value-1)==getCluster?'#000':'#fff'" stroke-width="1px" :fill="getFill(value-1)" @click="chooseCluster(value-1,$event)"></rect>
            </g>

            <g>
                <!-- <circle v-for="value in tree" :key="value.id" :cx="value.x+'px'" :cy="value.y+'px'" :r="radius_big" 
                :style="{fillOpacity:1,stroke:'#000',strokeWidth:.5,fill:'#000'}"></circle> -->
                <!-- <rect v-for="(value,index) in tree" :key="index" :x="value.x-radius_big" :y="value.y" :width="radius_big*2" :height="1"
                :style="{fillOpacity:1,stroke:'#000',strokeWidth:.5,fill:'#000'}"></rect>
                <rect v-for="(value,index) in tree" :key="index" :x="value.x" :y="value.y-radius_big" :width="1" :height="radius_big*2"
                :style="{fillOpacity:1,stroke:'#000',strokeWidth:.5,fill:'#000'}"></rect> -->
            </g>
            
            <path :d="pathData" :style="{fill:isFill,fillOpacity:.5,stroke:'#000',strokeWidth:2,}"/><!--圈选区域 -->
            <path :d="pathData2" :style="{fill:isFill,fillOpacity:.5,stroke:'#000',strokeWidth:2,strokeDasharray:dashArray}"/><!--圈选区域 显示闭合那段线-->

        </svg>
        
    </div>
</template>

<script>
import {mapGetters,mapActions} from "vuex";
import * as d3 from 'd3'
import * as d3Color from 'd3-scale-chromatic'
import pig  from '../components/pig'
import Vue from 'vue'
import ModelTree from './ModelTree'
//schemeCategory10
export default {
    name:'Projection',
    components:{pig,ModelTree},
    data(){
        return {
            location:[],
            locationDic:{},
            padding:{
                top:20,
                left:20,
                bottom:20,
                right:20,
                
            },
            width:0,
            height:-100,
            radius_ori:2,
            radius_big:5,
            drawFlag:false,
            pathData:"",
            pathData2:"",
            dashArray:'10 10',
            isFill:"none",
            pathPoint:[],
            tree:[],
            trees:[],
            ModelTree: [
                {name:0,children:[{name:1,children:[{name:2}]}]},
                10000,
            ],
            showState:['Origin','DBscan'],
            state:'Origin',
            PresentTree:[],
            showTreeState:0,
        }
    },
    computed:{
            ...mapGetters(["getLocation",'getChoosedTrees','getClusters','getCluster','getTree','getTrees','getSelectedModelTree']),
            getClustersX:function(){
                return function(nodes){
                    let allX=0;
                    for(var i=0;i<nodes.length;i++){
                        allX+=this.locationDic[nodes[i]].x;
                    }
                    return allX/nodes.length;
                }
            },
            getClustersY:function(){
                return function(nodes){
                    let allY=0;
                    for(var i=0;i<nodes.length;i++){
                        allY+=this.locationDic[nodes[i]].y;
                    }
                    return allY/nodes.length;
                }
            },
            getClustersR:function(){
                return function(nodes){
                    let allX=[];
                    let allY=[];
                    for(var i=0;i<nodes.length;i++){
                        allX.push(this.locationDic[nodes[i]].x);
                        allY.push(this.locationDic[nodes[i]].y);
                    }
                    let xmax=d3.max(allX);
                    let xmin=d3.min(allX);
                    let ymax=d3.max(allY);
                    let ymin=d3.min(allY);
                    let r=d3.max([xmax-xmin,ymax-ymin])/2;
                    return r;
                }
            },
            getFill:function(){
                return function(cluster){
                    
                    if(cluster>=12||cluster<0||this.state=='Origin'){
                        return '#fff';
                    }
                    else{
                        return d3Color.schemePaired[cluster];
                    }
                }
            },
            getPig:function(){
                return function(value){
                    let id=[142,17,0,31,37,0,81,132,162,224,249,274];
                    return id[value];

                }
            },
            getLoc:function(){
                return function(value){
                    let id=[
                        [100,100],
                        [200,100],
                        [300,100],
                        [400,100],
                        [100,100],
                        [100,100],
                        [100,100],
                        [100,100],
                        [100,100],
                        [100,100],
                        [100,100],
                        [100,100],
                        [100,100]
                    ]

                   return id[value];

                }
            },
    
        
        },
    methods:{
        ...mapActions(["fetchLocation","updateChoosedTrees","updateCluster","updateRepresentTree",
        "updateDifferentyTrees","updateDifferentTypes","updateChooseTypeIndex","setTrees","fetchPig",'updateSelectedModelTree','fetchTree']),
        initPath(){
            this.pathData="";
            this.pathData2='';
            this.dashArray='10 10';
            this.isFill="none";
            this.pathPoint=[];
        },
        startDraw(e){
            this.initPath();
            this.drawFlag=true;
            let x=e.layerX;
            let y=e.layerY;
            this.pathData+=`M${x} ${y} `;
            this.pathData2+=`M${x} ${y} Z`;
            this.pathPoint.push([x,y]);
        },
        drawing(e){
            if(this.drawFlag){
                let x=e.layerX;
                let y=e.layerY;
                this.pathData+=`L${x} ${y} `;
                this.pathData2=this.pathData2.slice(0,-1)+`L${x} ${y} Z`;
                this.pathPoint.push([x,y]);
            }
            
        },
        endDraw(e){
            this.drawFlag=false;
            // this.pathData+=`Z`;
            this.dashArray='0 0';
            let choosedTrees=[];
            for(var i=0;i<this.location.length;i++){
                if(this.isInPolygon([this.location[i].x,this.location[i].y],this.pathPoint)){
                    choosedTrees.push(this.location[i].id);
                }
            }
            // console.log(choosedTrees);
            this.updateChoosedTrees(choosedTrees);
            this.isFill="none";
        },
        isInPolygon(checkPoint, polygonPoints) {//判断一个点是否在多边形内
            var counter = 0;
            var i;
            var xinters;
            var p1, p2;
            var pointCount = polygonPoints.length;
            p1 = polygonPoints[0];
        
            for (i = 1; i <= pointCount; i++) {
                p2 = polygonPoints[i % pointCount];
                if (
                    checkPoint[0] > Math.min(p1[0], p2[0]) &&
                    checkPoint[0] <= Math.max(p1[0], p2[0])
                ) {
                    if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
                        if (p1[0] != p2[0]) {
                            xinters =
                                (checkPoint[0] - p1[0]) *
                                    (p2[1] - p1[1]) /
                                    (p2[0] - p1[0]) +
                                p1[1];
                            if (p1[1] == p2[1] || checkPoint[1] <= xinters) {
                                counter++;
                            }
                        }
                    }
                }
                p1 = p2;
            }
            if (counter % 2 == 0) {
                return false;
            } else {
                return true;
            }
        },

        getRAndD(){
            this.$axios.post('http://localhost:5000/api/cluster/dopython',{
                "cluster":this.getCluster,
            })
            .then(function (response) {
                if(response.data.data==true){
                    console.log("ok1")
                     this.$axios.post('http://localhost:5000/api/cluster/getRandD')
                     .then(function (response) {
                         this.updateRepresentTree(response.data.data.representTree);
                         this.updateDifferentTypes(response.data.data.types);
                         this.updateChooseTypeIndex(0);
                         this.updateDifferentyTrees(response.data.data.types[0].name);
                     }.bind(this));
                }else{
                    console.log("err1")
                }
            }.bind(this))
        },

        chooseCluster(cluster,event){
            let choosedTrees=this.getClusters[cluster];
            this.updateChoosedTrees(choosedTrees);
            // d3.select('#svg_pro')
            // .selectAll("rect")
            // .attr("stroke","#fff");
            this.updateCluster(cluster);
            this.getRAndD();
            // event.currentTarget.setAttribute('stroke','#000');
        },
        zooming() {
            // 放大缩小
            var svg = d3.select("#svg_pro");
            svg.call(
                d3.zoom().scaleExtent([1, 3.0]).on("zoom", zoom)
            );
 
            function zoom() {
                d3.select(this).selectAll("g").attr("transform", d3.event.transform);
            }
        },
        displayTree(value){
            let e = event || window.event;
            let x = e.offsetX;
            let y = e.offsetY;
            // const test = Vue.extend({
            //     template:'<div id="tree" ref="tree" style="position:absolute;backgroundColor:red;">{{text}}</div>',
            //     data:function(){
            //         return{
            //             text:'eeeeee',
            //         }
            //     }
            // });
            // new test().$mount("#tree"); 
            // if(value!=undefined){
            //     this.getTrees.forEach(element => {
            //         if(element.name == value.id){
            //             this.updateSelectedModelTree(element);
            //             console.log(this.getSelectedModelTree);
            //             this.$refs.tree.style.left=x+'px';
            //             this.$refs.tree.style.top=y+'px';
            //             this.$refs.tree.style.display="inline";
            //         }
            //     });
            // } 
            this.fetchTree(value.id); 
            console.log(value.id);
            // console.log("x:"+x);
            // console.log("y"+y);
        },
        getRepresentTree(){
            let treeName=['137692','137582','39756','110589','85033','103274','20083','129946','127206','48337','3256','80330']
            let representTree=[[310,550],[213,75],[440,266],[110,180], [10,280],[360,10],[600,620],[30,480],[360,631],[580,0],[800,493],[615,430]];
            let final=[]
            treeName.forEach((ele,index)=>{
                this.getTrees.forEach(eles=>{
                    if(ele==eles.name){
                        let temp = eles;
                        temp.x=representTree[index][0];
                        temp.y=representTree[index][1];
                        final.push(temp);
                    }
                })
            });
            this.PresentTree=this.showTreeState==0?final:[];
            this.showTreeState=this.showTreeState==0?1:0;
            console.log(this.PresentTree);

        }
    },

    mounted(){
        this.getRAndD();
        // this.getpigg();
    },
    watch:{
        getLocation:function(){
            var width=this.$refs.svgPro.clientWidth;
            var height=this.$refs.svgPro.clientHeight;
            this.height=height;
            this.width=width;
            var x_max=d3.max(this.getLocation,d=>parseFloat(d.x));
            var x_min=d3.min(this.getLocation,d=>parseFloat(d.x));
            var y_max=d3.max(this.getLocation,d=>parseFloat(d.y));
            var y_min=d3.min(this.getLocation,d=>parseFloat(d.y));

            var xScale=d3.scaleLinear().domain([x_min,x_max]).range([this.padding.left,width-this.padding.right]);
            var yScale=d3.scaleLinear().domain([y_min,y_max]).range([this.padding.top,height-this.padding.bottom]);

            this.location=[];
            this.locationDic={};
            for(var i=0;i<this.getLocation.length;i++){
                this.location.push({"id":this.getLocation[i].id,"x":xScale(parseFloat(this.getLocation[i].x)),
                "y":yScale(parseFloat(this.getLocation[i].y)),"cluster":this.getLocation[i].cluster});
                this.locationDic[this.getLocation[i].id]={"x":xScale(parseFloat(this.getLocation[i].x)),
                "y":yScale(parseFloat(this.getLocation[i].y)),"cluster":this.getLocation[i].cluster};
                
            };
        },
        getChoosedTrees(){
            d3.select('#svg_pro')
            .selectAll(".circle")
            .style("opacity","1")
            for(var i in this.getChoosedTrees){
                d3.select("#circle_"+this.getChoosedTrees[i].name)
                .style("opacity","0.5")
            }

            // this.$refs.chooseCircle.setAttribute("r",0)
        },

        getTree(){
            let id=this.getTree.name;
            this.tree=[];
            this.tree.push({"id":id,"x":this.locationDic[id].x,
                "y":this.locationDic[id].y,"cluster":this.locationDic[id].cluster});
        },

    }
    
}
</script>

<style scoped>
.projectionBox{
    width:100%;
    height:100%;
    border:1px solid #ccc;
    position: relative;
}
#svg_pro{
    width:100%;
    height:100%;
}
</style>