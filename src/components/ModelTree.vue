<template>
    <div class="mBox">
        <svg :id="'svg_model'+indexx" ref="svgModelTree" :style="{width:'80%',height:'100%'}">
        </svg>
    </div>
</template>

<script>
import * as d3 from 'd3'
import { mapGetters } from 'vuex';
export default {
    name:"ModelTree",
    data(){
        return {
            padding:{
                top:20,
                left:20,
            },
            radius:3,
            circleStrokeWidth:1,
            lineWidth:1.5,
        }
    },
    computed:{
        ...mapGetters(['getSelectedModelTree'])

    },
    props:['tree','indexx','keyy'],
    methods:{
        render(){
            console.log(2222222222222222);
            var width=this.$refs.svgModelTree.clientWidth;
            var height=this.$refs.svgModelTree.clientHeight;
            var tree=d3.tree().size([height-50,width-50])(d3.hierarchy(this.tree));
            // console.log(tree)
            var svg=d3.select("#svg_model"+this.indexx);
            svg.selectAll("g").remove();
            svg.selectAll('path').remove();
            var g=svg.append("g").attr("transform", `translate(${this.padding.left},${this.padding.top})`);
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
            .attr("r", this.radius)
            .attr("fill","white")
            .attr("stroke","steelblue")
            .attr("stroke-width",this.circleStrokeWidth)
        }
  
    },
    mounted(){
        this.render();
    },

}
</script>

<style scoped>
.mBox{
    box-sizing: border-box;
    width:100%;
    height:100%;
    margin:5px 20px 5px 0
}

</style>