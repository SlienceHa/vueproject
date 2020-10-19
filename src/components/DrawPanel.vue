<template>
    <div class="drawBox">
        <!-- <div class="btnBox">
            <input type="button" value="Search" class="search" @click="search">
            <input type="button" value="Pipei" class="pipei" @click="pipei">
        </div> -->
        <div class="drawPanel">
            <svg id="drawSvg" style="width:100%;height:100%;" @click.stop="drawNode" ref="drawSvg">
                <g class="nodes"></g>
                <g class="links"></g>
            </svg>
        </div>
        
    </div>
</template>

<script>
import * as d3 from 'd3' 
import {mapActions,mapGetters} from "vuex";
export default {
    name:"DrawPanel",
    data(){
        return {
            nodeList:[],
            linkList:[],
            link:[],
            index:0,
            r:7,
            history:[],

            padding:{
                top:30,
                left:20,
            },
            circleStrokeWidth:1,
            lineWidth:1.5,
            treeId:-1,
        } 
    },
    computed:{
        ...mapGetters(['getTrees'])
    },
    methods:{
        ...mapActions(["updateChoosedTrees","updateChoosedTreesByTreeEite"]),
        drawNode(e){
            let x=e.layerX;
            let y=e.layerY;
            let g=d3.select('#drawSvg').select(".nodes")
            .append("circle")
            .attr("cx",x)
            .attr("cy",y)
            .attr("r",this.r)
            .attr("fill","white")
            .attr("stroke","steelblue")
            .attr("stroke-width",this.circleStrokeWidth)
            .attr("data-name",this.index)
            .style("cursor","pointer")
            .on("click",function(){
                d3.event.cancelBubble=true;
                
                if(this.link.length<2){
                    let ele=d3.event.target
                    let name=ele.getAttribute("data-name");
                    let x=ele.cx.baseVal.value;
                    let y=ele.cy.baseVal.value;
                    this.link.push({name:name,x:x,y:y});
                    this.nodeList.push({name:name,x:x,y:y});
                }
                if(this.link.length==2){
                    
                    let link = d3.linkHorizontal()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; });

                    let pathData={};
                    pathData.source={x:this.link[0].x+this.r,y:this.link[0].y};
                    pathData.target={x:this.link[1].x-this.r,y:this.link[1].y};        

                    let lg=d3.select('#drawSvg').select(".links");
                    lg
                    .append("path")
                    .attr("fill", "none")
                    .attr("stroke", "#555")
                    .attr("stroke-opacity", 0.4)
                    .attr("stroke-width", this.lineWidth)
                    .attr("data-name",this.link[0].name+"to"+this.link[1].name)
                    .attr("d", link(pathData))
                    
                    this.linkList.push([this.link[0].name,this.link[1].name]);
                    this.link=[];
                    this.history.push("path");
                }
                
            }.bind(this))

            this.index++;
            this.history.push("circle");
        },

        search(){
            let exit=0;
            let name=0;
            for(let i in this.getTrees){
                if(this.getTrees[i].name==String(this.treeId)){
                    exit=1;
                    name=String(this.treeId);
                    break;
                }
            };
            console.log("exit:",exit)
            this.$axios.post('http://localhost:5000/api/search',{
                "data":this.linkList,
                'way':"graph2vec",
                'exit':exit,
                'name':name,
            })
            .then(function (response) {
                if(response.data.data==true){
                    console.log("ok1")
                     this.$axios.post('http://localhost:5000/api/graph2vec/graph2vec')
                     .then(function (response) {
                         this.pipei();
                     }.bind(this));
                }else{
                    console.log("err1")
                }
            }.bind(this))
            
        },

        pipei(){
            this.$axios.post('http://localhost:5000/api/graph2vec/pipei',{"count":50})
            .then(function (response) {
                console.log(response.data.data);
                let choosedTrees=response.data.data.map(value => {
                    return value.name;
                });
                console.log(choosedTrees);
                this.updateChoosedTrees(choosedTrees);
            }.bind(this))
        },

        serchByTreeEdit(){
            this.$axios.post('http://localhost:5000/api/search',{
                "data":this.linkList,
                "way":"treeEdit",
            })
            .then(function (response) {
                if(response.data.data==true){
                    console.log("ok1")
                     this.$axios.post('http://localhost:5000/api/treeEdit/treeEdit')
                     .then(function (response) {
                         this.pipeiTreeEdit();
                     }.bind(this));
                }else{
                    console.log("err1")
                }
            }.bind(this))
        },

        searchByTreeAndVector(){
            this.$axios.post('http://localhost:5000/api/search',{
                "data":this.linkList,
                "way":"treeEdit",
            })
            .then(function (response) {
                if(response.data.data==true){
                    console.log("ok1")
                     this.$axios.post('http://localhost:5000/api/treeEdit/treeEdit')
                     .then(function (response) {
                         this.pipeiTreeAndVector();
                     }.bind(this));
                }else{
                    console.log("err1")
                }
            }.bind(this))
        },

        pipeiTreeAndVector(){
            this.$axios.post('http://localhost:5000/api/treeEdit/getCloseDistance')
            .then(function (response) {
                let choosedTrees=response.data.data.map(value => {
                    return value.name;
                });
                this.updateChoosedTrees(choosedTrees);
            }.bind(this))
        },

        pipeiTreeEdit(){
            this.$axios.post('http://localhost:5000/api/treeEdit/getDistance',{"count":50})
            .then(function (response) {
                let choosedTrees=response.data.data.map(value => {
                    return value.name;
                });
                this.updateChoosedTrees(choosedTrees);
            }.bind(this))
        },

        redraw(){
            let gnode=d3.select('#drawSvg').select(".nodes").selectAll("circle").remove();
            let llink=d3.select('#drawSvg').select(".links").selectAll("path").remove();
            d3.selectAll('.gTree').remove();
            this.index=0;
            this.nodeList=[];
            this.linkList=[];
            this.link=[];
        },
        undo(){
            let type=this.history.pop();
            if(type=="circle"){
                let value=`circle[data-name='${this.index-1}']`;
                document.querySelector(value).remove();
                this.index--;
                this.link=[];
                this.nodeList.pop();
            }
            else{
                let length=this.linkList.length;
                let value=`path[data-name='${this.linkList[length-1][0]}to${this.linkList[length-1][1]}']`;
                
                document.querySelector(value).remove();
                this.link=[];
                this.linkList.pop();
            }
        },
        drawTree(tree,treeId){
            if(treeId){
                this.treeId=treeId;
            }
            
            var width=this.$refs.drawSvg.clientWidth;
            var height=this.$refs.drawSvg.clientHeight;

            var tree=d3.tree().size([height-50,width-50])(d3.hierarchy(tree));
            // console.log(tree)

            var svg=d3.select("#drawSvg");

            var g=svg.append("g").attr("transform", `translate(${this.padding.left},${this.padding.top})`).attr("class","gTree");
            
            const links=g.append("g")
            .selectAll("path")
            .data(tree.links())
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", this.lineWidth)
            .attr("d", d3.linkHorizontal()  //d3.linkVertical()  d3.linkHorizontal().x(d => d.y).y(d => d.x)
                .x(d =>d.y)
                .y(d =>d.x));
            
            let node = g.append("g")
            .selectAll("g")
            .data(tree.descendants())
            .enter()
            .append("g")
            .attr("transform", d => {
                    return `translate(${d.y},${d.x})`;    
            });

            node.append("circle")
            .attr("r", this.r)
            .attr("fill","white")
            .attr("stroke","steelblue")
            .attr("stroke-width",this.circleStrokeWidth)
        },
  
   
    }
}
</script>
<style scoped>
.drawBox{
    width:100%;
    height:100%;
    background: white;
}
.btnBox{
    width:100%;
    height:30px;
    box-sizing: border-box;
    border:1px solid #ccc;
}
.drawPanel{
    width:100%;
    height:100%;
    background: white;
    position: relative;
}
.search{
    width:auto;
    height:28px;
    border:1px solid #ccc;
    background-color: white;
    padding:2px 5px;
    border-radius:4px;
}
.pipei{
    width:auto;
    height:28px;
    border:1px solid #ccc;
    background-color: white;
    padding:2px 5px;
    border-radius:4px;
}
</style>
