<template>
    <div class="clusterTreeBox" :style="{height:'150px',width:'150px',position:'absolute',left:loc[0]+'px',top:loc[1]+'px'}">
        <svg :id="'svg_Pig'+treess.name" ref="svgRepresen" :style="{width:'100%',height:'100%'}">
        </svg>
    </div>
</template>

<script>
import {mapGetters,mapActions} from "vuex";
import * as d3 from 'd3'
export default {
    name:'pig',
    props:['tree','flag','Height','Width','padding','svgId','trees','loc'],
    data(){
        return{
            treess:""

        }

    },


    methods:{
        drawTree(){
                 for(let i=0;i<this.trees.length;i++)
                    {       
                            if(this.tree==this.trees[i].name)
                            {
                            //    console.log(this.tree);
                            //    console.log(this.trees[i]);
                               this.treess=this.trees[i];
                            }
                    }
                    if(this.treess=="")
                        this.treess=this.trees[0];

                var width=this.$refs.svgRepresen.clientWidth;
                var height=this.$refs.svgRepresen.clientHeight;

                var tree=d3.tree().size([height-50,width-50])(d3.hierarchy(this.treess));
                console.log(tree);
                let svg=d3.select("#svg_Pig"+this.treess.name);

                let g=svg.append("g").attr("transform", `translate(${this.padding.left},${this.padding.top})`);
                
                let links=g.append("g")
                .selectAll("path")
                .data(tree.links())
                .enter()
                .append("path")
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5)
                .attr("d", d3.linkHorizontal()  //d3.linkVertical()  d3.linkHorizontal().x(d => d.y).y(d => d.x)
                    .x(d =>d.y)
                    .y(d =>d.x));
                
                let node = g.append("g")
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 3)
                .selectAll("g")
                .data(tree.descendants())
                .enter()
                .append("g")
                .attr("transform", d => {
                    // if(d.data.birthyear=="-99"||d.data.birthyear=="-98")
                        return `translate(${d.y},${d.x})`;
                    // else{
                    //     return `translate(${YearScale(d.data.birthyear)},${d.x})`;
                    // }
                        
                });
                
                // node.append("circle")
                // .attr("r", 5)
                // .attr("opacity",1)
                // .attr("fill","white")
                // .attr("stroke","steelblue")
                // .attr("stroke-width,2")

                node.append("circle")
                // .attr("fill", d => d.children ? "#555" : "#999")
                .attr("r", 5)
                .attr("opacity",d=>{
                    if(d.data.sex=="1")
                        return 1;
                    else 
                        return 0;
                })
                .attr("fill","white")
                .attr("stroke","steelblue")
                .attr("stroke-width,1")
                // .on("click",d=>console.log(d.data))
                

                node.append("rect")
                .attr("width",10)
                .attr("height",10)
                .attr("transform",'translate(-5,-5)')
                .attr("opacity",d=>{
                    if(d.data.sex=="2")
                        return 1;
                    else if((d.data.sex=="-99"||d.data.sex=="-98"))
                        return 1;
                    else 
                        return 0;
                })
                .attr("fill","white")
                .attr("stroke","steelblue")
                .attr("stroke-width",1)
                // .on("click",d=>console.log(d.data))

            }
        
    },
    // mounted(){
    //     this.drawTree();
    // },
    watch:{
        trees:function(){
            this.drawTree();
        }
    }

}
</script>

<style scoped>
.clusterTreeBox{
    float:left;
}
</style>