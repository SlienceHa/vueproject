<template>
    <div class="clusterTreeBox" :style="{transform:'translateY(-'+flag*100+'%)',transition:'.5s',height:Height,width:Width}">
        <svg :id="'svg_Cluster'+svgId+tree.name" ref="svgRepresent" :style="{width:'100%',height:'100%'}">

        </svg>
    </div>
</template>

<script>
import * as d3 from 'd3'
export default {
    name:'ClusterTree',
    props:['tree','flag','Height','Width','padding','svgId'],
    
    methods:{
        drawTree(){
                var width=this.$refs.svgRepresent.clientWidth;
                var height=this.$refs.svgRepresent.clientHeight;

                var tree=d3.tree().size([height-50,width-50])(d3.hierarchy(this.tree));
                console.log("333333333");
                console.log(this.tree);
                var svg=d3.select("#svg_Cluster"+this.svgId+this.tree.name);

                var g=svg.append("g").attr("transform", `translate(${this.padding.left},${this.padding.top})`);
                
                const links=g.append("g")
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
    mounted(){
        this.drawTree();
    }
}
</script>

<style scoped>
.clusterTreeBox{
    float:left;
}
</style>