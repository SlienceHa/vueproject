<template>
    <div class="TreeBox">
        <span>village:</span>
        <svg style="height:16px;margin:5px 0 0 0">      
            <rect v-for="(value,index) in villageColor" :key="value" width="15px" height="15px" :x="15+(index-1)*17" :y="height-20" :fill="value"></rect>
        </svg>
        <span>Position:</span>
        <svg style="height:16px;margin:5px 0 0 0">      
            <rect width="15px" height="15px" fill="white" stroke="red"></rect>
        </svg>
        <svg :id="'svg_tree'+svgId" ref="svgTree" style="width:100%;height:100%">
            
        </svg>
    </div>
</template>
<script>
import {mapGetters,mapActions} from "vuex";
import * as d3 from 'd3'    
import * as d3Color from 'd3-scale-chromatic'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import treeinfo from './TreeInfo'
export default {
    name:'Tree',
    props:['svgId','getTree'],
    data(){
        return{
            Age:0,
            padding:{
                top:50,
                left:20,
            },
            maxYear:0,
            minYear:0,
            YearScale:null,
            g:null,
            node:null,
            r:5,
            lineWidthMax:10,
            lineWidthMin:1,
            rectWidth:10,
            rectHeight:10,
            villageColor:[],
        };
    },
    methods:{
        render(){
            var maxAge=this.getMaxAge(this.getTree);
            var minAge=this.getMinAge(this.getTree);
            var maxYear=this.getMaxYear(this.getTree);
            var minYear=this.getMinYear(this.getTree);
            this.maxYear=maxYear;
            this.minYear=minYear;
            // console.log(maxYear,minYear);

            var AgeScale=d3.scaleLinear().domain([minAge,maxAge]).range([0,1]);
            var ageScale=d3.scaleLinear().domain([minAge,maxAge]).range([8,16]);
            
            var a = d3.rgb(0,100,0);	
            var b = d3.rgb(0,255,0);	
 
            var compute = d3.interpolate(b,a);

            var width=this.$refs.svgTree.clientWidth-this.padding.left-50;
            var height=this.$refs.svgTree.clientHeight-this.padding.top-30;
            var YearScale=d3.scaleLinear().domain([1700,1900]).range([this.padding.left,width]);
            this.YearScale=YearScale;
            var xAxis=d3.axisTop().scale(YearScale);

            var tree=d3.tree().size([height,width])(d3.hierarchy(this.getTree));
             //确立间隔
            let cap=height/tree.data.count;
            tree.data.yyyy=0;
            // console.log(cap);
            let start=0;
            let sum=0;
             function getCap(d){
                d.data.yyyy=start;
                start+=cap;
                if(d.children)
                    {    
                        for(let i=0;i<d.children.length;i++)
                            {       
                                getCap(d.children[i]);
                            }
                    }
                } 
            getCap(tree);

            var svg=d3.select("#svg_tree"+this.svgId);
            svg.selectAll("g").remove();
            var g=svg.append("g").attr("transform", `translate(${this.padding.left},${this.padding.top})`);
            var xg=svg.append("g").attr("transform",`translate(${this.padding.left},${height+50})`);
            xAxis(xg);

            // console.log(tree.links())
            var maxChildrenCount=0;
            if(tree.children){
                for(let i=0;i<tree.children.length;i++){
                    if(this.getNodeChildrenCount(tree.children[i])>maxChildrenCount)
                        maxChildrenCount=this.getNodeChildrenCount(tree.children[i]);
                }
            }
            else{
                maxChildrenCount=0;
            };
            // console.log('max:',maxChildrenCount)
            var lineWidthScale=d3.scaleLinear().domain([0,maxChildrenCount])
            .range([this.lineWidthMin,this.lineWidthMax]);
            
            const links=g.append("g")
            .selectAll("path")
            .data(tree.links())
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", d=>{
                return lineWidthScale(this.getNodeChildrenCount(d.target));
            })
            .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x))
            .style('transition',"d 1.5s")
            this.g=links;
            
            let node = g.append("g")
            .selectAll("g")
            .data(tree.descendants())
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .style('transition',"transform 1.5s")
            
            this.node=node;
            
            node.append("circle")
            .attr("r", this.r)
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
                // var color=compute(AgeScale(d.data.age));
                // return d3.rgb(color.r,color.g,color.b);
                return d3Color.interpolateRdBu(AgeScale(d.data.age));
            })
            const villageData=[];
            const villageIndex=0;
            const color=['antiquewhite','aqua','aquamarine','azure','beige','bisque',' blanchedalmond','blue','brown','burlywood','cadetblue','chartreuse','cyan','darkblue','darkcyan','firebrick','floralwhite','forestgreen']
            node.append("rect")
            .attr("width",d=>{return ageScale(d.data.age)<0?8:ageScale(d.data.age) ;})
            .attr("height",d=>{return ageScale(d.data.age)<0?8:ageScale(d.data.age) ;})
            .attr("transform",`translate(${-this.rectWidth/2},${-this.rectHeight/2})`)
            .attr("opacity",d=>{
                if(d.data.sex=="2")
                    return 1;
                else if((d.data.sex=="-99"||d.data.sex=="-98")&&d.children)
                    return 1;
                else 
                    return 0;
            })
            .attr("fill",d=>{
                // if(AgeScale(d.data.age)>1||(AgeScale(d.data.age))<0){
                //     return "#ff0000";
                // }
                // var color=compute(AgeScale(d.data.age));
                // return d3.rgb(color.r,color.g,color.b)
                if (villageData.includes(d.data.village)){
                    return color[villageData.indexOf(d.data.village)]
                }else{
                    villageData.push(d.data.village);
                    return color[villageData.indexOf(d.data.village)]
                }

            })
            .attr("stroke",d=>{
                if(d.data.guan=="1"){
                    return 'red';
                }else{
                    return 'white';
                }
            },"2px")
            .on('click',d=>console.log(d));
            this.villageColor=color.splice(0,villageData.length);

            // // 标识
            // svg.append("circle")
            // .attr("r",10)
            // .attr("cx",width+90)
            // .attr("cy",15)
            // .attr("fill","none")
            // .attr("stroke-width",2)
            // .attr("stroke","#ccc")

            // svg.append("rect")
            // .attr("x",width)
            // .attr("y",5)
            // .attr("width",20)
            // .attr("height",20)
            // .attr("fill","none")
            // .attr("stroke-width",2)
            // .attr("stroke","#ccc")

            // svg.append("text")
            // .attr("x",width+25)
            // .attr("y",20)
            // .attr("font-size",16)
            // .text("Male")

            // svg.append("text")
            // .attr("x",width+25+55+25)
            // .attr("y",20)
            // .attr("font-size",16)
            // .text("Female")


            // var defs = svg.append("defs");
 
            // var linearGradient = defs.append("linearGradient")
			// 			.attr("id","linearColor")
			// 			.attr("x1","0%")
			// 			.attr("y1","0%")
			// 			.attr("x2","100%")
			// 			.attr("y2","0%");
 
            // var stop1 = linearGradient.append("stop")
			// 	.attr("offset","0%")
			// 	.style("stop-color",d3Color.interpolateRdBu(0));
 
            // var stop2 = linearGradient.append("stop")
			// 	.attr("offset","100%")
            //     .style("stop-color",d3Color.interpolateRdBu(1));
                
            // var colorRect = svg.append("rect")
			// 	.attr("x", width-100-this.padding.right)
			// 	.attr("y", 5)
			// 	.attr("width", 100)
			// 	.attr("height", 20)
			// 	.style("fill","url(#" + linearGradient.attr("id") + ")");

        },
        area(){  
                var maxAge=this.getMaxAge(this.getTree);
                var minAge=this.getMinAge(this.getTree);
                var maxYear=this.getMaxYear(this.getTree);
                var minYear=this.getMinYear(this.getTree);
                this.maxYear=maxYear;
                this.minYear=minYear;
                let padding = {
                    left: 20,
                    right: 30,
                    top: 20,
                    bottom: 20
                };
                var width=this.$refs.svgAge.clientWidth-this.padding.left-50;
                var height=this.$refs.svgAge.clientHeight-this.padding.top;

                var svg=d3.select("#svg_Age"+this.svgId)
                    .attr('width', width + 'px')
                    .attr('height', height + 'px')
                svg.selectAll("g").remove();
                svg.selectAll('path').remove();
                let xScale = d3.scaleLinear().domain([1700,1900]).range([this.padding.left,width])
                let yScale = d3.scaleLinear().domain([0,10]).range([height - padding.top, 0])
                let xAxis = d3.axisBottom().scale(xScale)
                let yAxis = d3.axisLeft().scale(yScale)
                svg.append('g')
                    .attr('class', 'axis')
                    .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
                    .call(xAxis)
                svg.append('g')
                    .attr('class', 'axis')
                    .attr('transform', 'translate(37,4)')
                    .call(yAxis)

                var tree=d3.tree().size([height,width])(d3.hierarchy(this.getTree));
                let left=padding.left+20;
                console.log("1111");
               
                let set=[];
                set.push(tree);
                function getAge(d){
                    if(d.children)
                    {    
                        for(let i=0;i<d.children.length;i++)
                            {
                                set.push(d.children[i]);
                                getAge(d.children[i]);
                            }
                    }
                } 
                getAge(tree);
                console.log(set);
                var color=["red","blue","yellow","black","green","purple","pink","yellow","orange"]
                //遍历每一层
                for(let k=tree.height;k>=0;k--)
                {   
                    //这一层的年龄分布
                    let tmp_age=[];
                    let minbirth=1000000;
                    let maxbirth=0;
                    let tmp_c=[]
                    for(let a=0;a<set.length;a++)
                    {
                        if(set[a].depth==k)
                        {   
                            tmp_c.push(set[a]);
                            if(parseInt(set[a].data.birthyear)<minbirth &&parseInt(set[a].data.birthyear)>0)
                                minbirth=parseInt(set[a].data.birthyear);
                            
                            if((parseInt(set[a].data.birthyear)+parseInt(set[a].data.age))>maxbirth)
                                maxbirth=(parseInt(set[a].data.birthyear)+parseInt(set[a].data.age))
                        }
                    }
                    for(let i=minbirth;i<=maxbirth;i++)
                    {   
                        var count=0;
                        for(let x=0;x<tmp_c.length;x++)
                        {
                            if(parseInt(tmp_c[x].data.birthyear)<=i && (parseInt(tmp_c[x].data.birthyear)+parseInt(tmp_c[x].data.age))>i)
                                count+=1;
                            if(parseInt(tmp_c[x].data.birthyear)<0)
                                count+=1;
                        }
                        tmp_age.push(count);

                    }
                    left=xScale(minbirth)+20;
                    let area = d3.area()
                        .x(function (d, i) { return left + i*(width-padding.left)/(maxYear-minYear) })
                        .y(function (d, i) { return height - padding.bottom})
                        .y1(function (d, i) { return yScale(d)})
                        .curve(d3.curveBasis)

                    svg.append('path')
                        .attr('d', area(tmp_age))
                        .style('fill', color[k])
                    

                }


        },

        getChildrenMinBirthyear(d){//获得孩子节点中的最小出生年
            let childMinBiryear=d3.min(d.children,data=>{
                if(data.data.birthyear=='-99'||data.data.birthyear=='-98')
                    return 10000;
                return Number(data.data.birthyear)
            });
            return childMinBiryear;
        },

        getBrotherMinBirthyear(d){
            let brotherMinBirthyear=d3.min(d.parent.children,data=>{
                if(data.data.birthyear=='-99'||data.data.birthyear=='-98')
                    return 10000;
                return Number(data.data.birthyear)
            });
            return brotherMinBirthyear;
        },

         transition(){
            this.g
            
            .attr("d", d3.linkHorizontal()  //d3.linkVertical()  d3.linkHorizontal().x(d => d.y).y(d => d.x)
                .x(d => {
                    if(d.data.birthyear=="-99"||d.data.birthyear=="-98")
                    {
                        if(!d.parent){//根节点且有孩子
                            let childMinBiryear=this.getChildrenMinBirthyear(d);
                            if(childMinBiryear==10000)
                                return d.y
                            else return this.YearScale(childMinBiryear-20);
                        }
                        else if(!d.parent&&!d.children){//单独一个根节点
                            return d.y;
                        }
                        else if(d.parent&&!d.children){//有父亲没孩子
                            if(d.parent.data.birthyear=='-99'||d.parent.data.birthyear=='-98'){
                                let brotherMinBirthyear=this.getBrotherMinBirthyear(d);
                                if(brotherMinBirthyear==10000){//如果兄弟出生年都未知
                                    return d.y;
                                }
                                else
                                    return this.YearScale(brotherMinBirthyear);
                            }
                            else{
                                return this.YearScale(Number(d.parent.data.birthyear)+15);
                            }
                        }
                        else if(d.parent&&d.children){//有父亲有孩子
                            let childMinBiryear=this.getChildrenMinBirthyear(d);
                            if(d.parent.data.birthyear=='-99'||d.parent.data.birthyear=='-98'){//父亲出生年未知
                                let brotherMinBiryear=this.getBrotherMinBirthyear(d);
                                if(childMinBiryear==10000&&brotherMinBiryear==10000){//孩子出生年都未知
                                    return d.y;
                                }
                                else if(childMinBiryear==10000&&brotherMinBiryear!=10000){
                                    return this.YearScale(brotherMinBiryear)
                                }
                                else if(childMinBiryear!=10000&&brotherMinBiryear==10000){
                                    return this.YearScale(childMinBiryear-20);
                                }
                                else{
                                    return this.YearScale(childMinBiryear-20);
                                }
                            }
                            else{//父亲出生年已知
                                if(childMinBiryear==10000)
                                    return this.YearScale(Number(d.parent.data.birthyear)+15);
                                else return this.YearScale((childMinBiryear+Number(d.parent.data.birthyear))/2);
                            }
                        }
                        
                    } 
                    else return this.YearScale(Number(d.data.birthyear));
                })
                .y(d =>d.x));

            this.node
            // .style('transition',"transform 2s")
            .attr("transform", d => {
                if(d.data.birthyear=="-99"||d.data.birthyear=="-98"){
                    let ty=d.y;
                    if(!d.parent){//根节点且有孩子
                            let childMinBiryear=this.getChildrenMinBirthyear(d);
                            if(childMinBiryear==10000)
                                ty= d.y
                            else ty= this.YearScale(childMinBiryear-20);
                        }
                        else if(!d.parent&&!d.children){//单独一个根节点
                            ty= d.y;
                        }
                        else if(d.parent&&!d.children){//有父亲没孩子
                            if(d.parent.data.birthyear=='-99'||d.parent.data.birthyear=='-98'){
                                let brotherMinBirthyear=this.getBrotherMinBirthyear(d);
                                if(brotherMinBirthyear==10000){//如果兄弟出生年都未知
                                    ty= d.y;
                                }
                                else
                                    ty= this.YearScale(brotherMinBirthyear);
                            }
                            else{
                                ty= this.YearScale(Number(d.parent.data.birthyear)+15);
                            }
                        }
                        else if(d.parent&&d.children){//有父亲有孩子
                            let childMinBiryear=this.getChildrenMinBirthyear(d);
                            if(d.parent.data.birthyear=='-99'||d.parent.data.birthyear=='-98'){//父亲出生年未知
                                let brotherMinBiryear=this.getBrotherMinBirthyear(d);
                                if(childMinBiryear==10000&&brotherMinBiryear==10000){//孩子出生年都未知
                                    ty= d.y;
                                }
                                else if(childMinBiryear==10000&&brotherMinBiryear!=10000){
                                    ty= this.YearScale(brotherMinBiryear)
                                }
                                else if(childMinBiryear!=10000&&brotherMinBiryear==10000){
                                    ty= this.YearScale(childMinBiryear-20);
                                }
                                else{
                                    ty= this.YearScale(childMinBiryear-20);
                                }
                            }
                            else{//父亲出生年已知
                                if(childMinBiryear==10000)
                                    ty=this.YearScale(Number(d.parent.data.birthyear)+15);
                                else ty= this.YearScale((childMinBiryear+Number(d.parent.data.birthyear))/2);
                            }
                        }

                    return `translate(${ty},${d.x})`;
                }
                   
                else
                    return `translate(${this.YearScale(d.data.birthyear)},${d.x})`;
            });
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
        getNodeChildrenCount(d){//获得该节点的所有后代数量
            let count=0;
            if(d.children){
                for(let i=0;i<d.children.length;i++){
                    count+=this.getNodeChildrenCount(d.children[i])+1;
                }
                return count;
            }
            else{
                return 0;
            }
        },
        
    },
    watch:{
        getTree:function () {
            this.render();
            // this.area();
            setTimeout(this.transition,200);
        },
        // getTriFlag:function(){
        //     if(this.getTriFlag==true){
        //         this.transition();
        //     }
        // }
    }
}
</script>

<style scoped>
.TreeBox{
    width:100%;
    height:100%;
    box-sizing: border-box;
    float: left;
}

.tooltip{
	position: absolute;
	width: 120px;
	height: auto;
	font-family: simsun;
	font-size: 14px;
    color: black;
	text-align: center;
	border-width: 2px solid black;
	background-color: black;
	border-radius: 5px;
}
</style>
