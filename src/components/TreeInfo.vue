<template>
    <div class="TreeBox">
        <div :style="{height:'90%',width:'100%',float:'right'}">
            <!-- <div :style="{height:'10%',backgroundColor:'black'}"></div> -->
            <!-- <single v-for="(tree,index) in trees" :key='tree' :xx=ageSet[index] :guan=positionSet[index] :gap=gap/2.5 :Age=AgeSet[index] ref='svgSingle' :style="{height:gap+'px',width:'100%'}"></single> -->
        </div>
    </div>
</template>
<script>
import {mapGetters,mapActions} from "vuex";
import * as d3 from 'd3'
import * as d3Color from 'd3-scale-chromatic'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import single from '../components/Single'
import tree from '../components/Tree'
export default {
    props:['svgId','getTree'],
    components:{single},
    data(){
        return{
            trees:null,
            gap:0,
            ageSet:[],
            positionSet:[],
            AgeSet:[]
        };
    },
    methods:{
        render(){

            let set=[]
            let start=0;
            var tree=this.getTree;
            let cap = 500 /tree.count;
            function getCapp(d){
                set.push(d);
                start+=cap;
                if(d.children)
                    {    
                        for(let i=0;i<d.children.length;i++)
                            {       
                                getCapp(d.children[i]);
                            }
                    }
                } 
            getCapp(tree);
            let width=90;
            let ageset=[];
            let positionset=[];
            let AgeSet=[];
            //设置年龄比例尺
            let minBirth=1000000;
            let maxBirth=0;
            let maxAge=0;
            for(let i=0;i<set.length;i++)
            {
                let birth=set[i].birthyear;
                if(set[i].birthyear==-98)
                    birth=1750;
                if(birth<minBirth)
                    minBirth=birth;
                if(birth>maxBirth)
                    maxBirth=birth;
                if(set[i].age>maxAge)
                    maxAge=set[i].age;
            }
            let ageScale=d3.scaleLinear().domain([minBirth,maxBirth]).range([this.gap,width]);
            let AgeScale=d3.scaleLinear().domain([0,120]).range([0,width]);

            for(let i =0;i<set.length;i++)
            {   
                let birth=set[i].birthyear;
                if(set[i].birthyear==-98)
                    birth=1750;
                //出生年月比例尺设置
                let age=ageScale(Math.abs(parseInt(birth)))-this.gap/2;
                ageset.push(age);
                //是否做官设置
                if(set[i].guan=='1')
                    positionset.push('steelblue');
                else if(set[i].guan=='0')
                    positionset.push('rgba(241,243,244)');
                else
                    positionset.push('white');
                //年龄设置
                let Age=AgeScale(Math.abs(parseInt(set[i].age)));
                AgeSet.push(Age);
            }

            this.trees=set;
            this.gap=cap;
            this.ageSet=ageset;
            this.positionSet=positionset;
            this.AgeSet=AgeSet;
        }

        },

    watch:{
        getTree:function () {
            
            this.render();
        },
    }
}
</script>

<style scoped>
.TreeBox{
    width:50%;
    height:100%;
    box-sizing: border-box;
     float: left;
    /* border:1px solid #ccc; */
}
</style>
