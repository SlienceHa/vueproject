<template>
    <div class="ctBox" :style="{transform:'translateY(-'+flag*100+'%)',transition:'.5s',height:Height,width:Width}">
        <svg :id="'svg_'+tree.name" ref="svgCtree" :style="{width:'100%',height:'100%'}">

        </svg>
        
    </div>
</template>

<script>
import * as d3 from 'd3'
export default {
    name:"Ctree",
    data(){
        return {
            Age:0,
            padding:{
                top:30,
                left:20,
            },
            maxYear:0,
            minYear:0,
        }
    },
    props:['tree','index','flag','Height','Width'],
    methods:{
        render(){
            var maxAge=this.getMaxAge(this.tree);
            var minAge=this.getMinAge(this.tree);
            var maxYear=this.getMaxYear(this.tree);
            var minYear=this.getMinYear(this.tree);
            this.maxYear=maxYear;
            this.minYear=minYear;
            // console.log(maxYear,minYear);

            var AgeScale=d3.scaleLinear().domain([minAge,maxAge]).range([0,1]);
            
            
            var a = d3.rgb(0,100,0);	
            var b = d3.rgb(0,255,0);	
 
            var compute = d3.interpolate(b,a);

            var width=this.$refs.svgCtree.clientWidth;
            var height=this.$refs.svgCtree.clientHeight;
            var YearScale=d3.scaleLinear().domain([minYear,maxYear]).range([this.padding.left+50,width-50]);
            var xAxis=d3.axisTop().scale(YearScale);

            var tree=d3.tree().size([height-50,width-50])(d3.hierarchy(this.tree));
            

            
            var svg=d3.select("#svg_"+this.tree.name);
            // svg.selectAll("g").remove();
            var g=svg.append("g").attr("transform", `translate(${this.padding.left},${this.padding.top})`);
            // var xg=svg.append("g").attr("transform",`translate(${this.padding.left},${height/4*5-50})`);
            // xAxis(xg);
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
                .x(d => {
                    if(d.data.birthyear=="-99"||d.data.birthyear=="-98") return d.y ;
                    else return YearScale(Number(d.data.birthyear));
                })
                .y(d =>d.x));
            
            let node = g.append("g")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .selectAll("g")
            .data(tree.descendants())
            .enter()
            .append("g")
            .attr("transform", d => {
                if(d.data.birthyear=="-99"||d.data.birthyear=="-98")
                    return `translate(${d.y},${d.x})`;
                else{
                    return `translate(${YearScale(d.data.birthyear)},${d.x})`;
                }
                    
            });
            
            node.append("circle")
            // .attr("fill", d => d.children ? "#555" : "#999")
            .attr("r", 5)
            .attr("opacity",d=>{
                if(d.data.sex=="1")
                    return 1;
                else 
                    return 0;
            })
            .attr("fill",d=>{
                
                if(AgeScale(d.data.age)>1||(AgeScale(d.data.age))<0){
                    return "#ff0000";
                }
                var color=compute(AgeScale(d.data.age));
                return d3.rgb(color.r,color.g,color.b)
            })
            .on("click",d=>console.log(d.data))
            

            node.append("rect")
            .attr("width",10)
            .attr("height",10)
            .attr("transform",'translate(-5,-5)')
            .attr("opacity",d=>{
                if(d.data.sex=="2")
                    return 1;
                else if((d.data.sex=="-99"||d.data.sex=="-98")&&d.children)
                    return 1;
                else 
                    return 0;
            })
            .attr("fill",d=>{
                
                if(AgeScale(d.data.age)>1||(AgeScale(d.data.age))<0){
                    return "#ff0000";
                }
                var color=compute(AgeScale(d.data.age));
                return d3.rgb(color.r,color.g,color.b)
            })
            .on("click",d=>console.log(d.data))
            

        },
        getMaxAge(tree){
            var age=Number(tree.age);
            if(tree.hasOwnProperty("children")){
                for(var i=0;i<tree.children.length;i++){
                    age=d3.max([age,this.getMaxAge(tree.children[i])]);
                }
                return age;
            }
            else{
                return d3.max([age,-99]);
            }
        },
        getMinAge(tree){
            var age=Number(tree.age)==-99?1000:Number(tree.age);
            if(tree.hasOwnProperty("children")){
                for(var i=0;i<tree.children.length;i++){
                    age=d3.min([age,this.getMinAge(tree.children[i])]);
                }
                return age;
            }
            else{
                return age;
            }
        },
        getMaxYear(tree){
            var year=Number(tree.birthyear);
            if(tree.hasOwnProperty("children")){
                for(var i=0;i<tree.children.length;i++){
                    year=d3.max([year,this.getMaxYear(tree.children[i])]);
                }
                return year;
            }
            else{
                return d3.max([year,-99]);
            }
        },
        getMinYear(tree){
            var year=Number(tree.birthyear)==-99?10000:Number(tree.birthyear);
            if(year==-98){
                year=10000;
            }
            if(tree.hasOwnProperty("children")){
                for(var i=0;i<tree.children.length;i++){
                    year=d3.min([year,this.getMinYear(tree.children[i])]);
                }
                return year;
            }
            else{
                return d3.min([year,10000]);
            }
        },
        
        render2(){
            
            var width=this.$refs.svgCtree.clientWidth;
            var height=this.$refs.svgCtree.clientHeight;

            var tree=d3.tree().size([height-50,width-50])(d3.hierarchy(this.tree));

            var svg=d3.select("#svg_"+this.tree.name);

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
        this.render2();
    },
}
</script>

<style scoped>
.ctBox{
    padding:5px 5px;
    box-sizing: border-box;
    /* border:1px solid #ccc; */
    float:left;
    z-index:-1;
    position:relative;
    
}

</style>