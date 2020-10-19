<template>
    <div class="container">
        <div class="box1">
            <div class="boxContent">
                <Title :title="'Tree View'">
                    <!-- <el-button :style="{'float':'right','line-height':'0.05'}" @click="showDetail">ShowDetail</el-button> -->
                </title>
                <div class="content" :style="{'height':'calc(100% - '+height+'px)'}" >
                    <Tree :svgId="'ori'" :getTree="getTree"/>
                     <!-- <treeInfo  :getTree="getTree" >
                        <div :style="{height:'100%',float:'right',width:'10%'}">
                            <Tree :svgId="'ori'" :getTree="getTree"/>
                        </div>
                    </treeInfo> -->
                </div>
            </div>
        </div>
        <div class="box2">
            <div class="boxContent">
                <Title :title="'Projection View'"/>
                <div class="content" :style="{'height':'calc(100% - '+height+'px)'}" >
                    <Projection/>
                </div>
            </div>
        </div>
        <div class="box1">
            <div class="boxContent">
                <Title :title="'SimilarTree View'">
                    <!-- <el-button :style="{'float':'right','line-height':'0.05'}" @click="showDetail">ShowDetail</el-button> -->
                </title>
                <div class="content" :style="{'height':'calc(100% - '+height+'px)'}" >
                      <Tree :svgId="'sim'" :getTree="getTree2"/>
                     <!-- <treeInfo  :getTree="getTree" >
                        <div :style="{height:'100%',float:'right',width:'10%'}">
                            <Tree :svgId="'ori'" :getTree="getTree"/>
                        </div>
                    </treeInfo> -->
                </div>
            </div>
        </div>
        <div class="box3A4">
            <div class="boxContent">
                <Title :title="'CandidateTree View'"/>
                <div style="width:99.5%;height:90%;margin:5px;border-bottom:1px solid gray;overflowX:hidden;overflowY:scroll;">
                    <ul :style="{'width':'900px','height':'100%',textalgin:'center',listStyle:'none'}">
                        <li v-for="(value,index) in this.modelTree" :key="value.name" @click="changeTree2(value)" style="width:140px; text-align:center;height:140px;float:left;margin:10px 0 0 7px;" :style="{border:value.state==0?'1px solid steelblue':'1px solid red'}">
                                <ModelTree :indexx="index+5" :tree="value" />
                        </li>
                    </ul>
                </div>
                <div>
                </div>
               
            </div>
        </div>
         <div class="box4">
            <div class="boxContent">
                <Title :title="'Parallel View'"/>
                <div class="content" :style="{'height':'calc(100% - '+height+'px)'}">
                    <!-- <Ctree v-for="(item,key) in getClusters" :key="key" :Height="'25%'" :Width="'20%'"
                    :flag="0" :tree="getOverTree(item[0])"/> -->
                    <!-- <Cluster :representTree="getRepresentTree" :differentTrees="getDifferentyTrees" :differentTypes="getDifferentTypes"/> -->
                    <info></info>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Tree from '../components/Tree'
import Projection from '../components/Projection'
import Compare from '../components/Compare'
import DrawPanel from '../components/DrawPanel'
import Title from '../components/Title'
import Ctree from '../components/Ctree'
import Cluster from '../components/Cluster'
import treeInfo from '../components/TreeInfo'
import info from '../components/info'
import ModelTree from '../components/ModelTree';
import {mapGetters,mapActions} from "vuex";
import box3 from '../components/box3'
import treeAttr from '../components/treeAttr'
export default {
    name:'GraphPanel',
    components:{
        Tree,
        Projection,
        Compare,
        DrawPanel,
        Title,
        Ctree,
        Cluster,
        treeInfo,
        info,
        box3,
        treeAttr,
        ModelTree
    },
    computed:{
        ...mapGetters(['getChoosedTrees','getChoosedTreesByTreeEite','getClusters','getTrees','getRepresentTree',
        'getDifferentyTrees','getDifferentTypes','getTree','getTree2','getSelectedTree','getSelectedTree1','getChangeState']),
        getOverTree:function(){
            return function (treeId){
                let tree={};
                for(let i=0;i<this.getTrees.length;i++){
                    if(this.getTrees[i].name==treeId){
                        console.log(treeId)
                        return this.getTrees[i]
                    }
                }
                return tree;
            }
        }
    },
    data(){
        return {
            height:this.$store.state.titleHeight,
            selectTreeId:'',
            state:0,
            state_start:0,
            state_show:1,
            modelTree:[],
        }
    },
    methods:{
        ...mapActions(['updateTree2','fetchSelectedTree1','updateChangeState']),
        nextClick(){
            this.$refs.Compare.nextOne();
        },
        lastClick(){
            this.$refs.Compare.lastOne();
        },
        changeSimTree(){
            this.updateTree2(this.selectTreeId);
        },
        showDetail(){
            this.state=1;
        },
        changeTree2(value){
            console.log(value);
            this.updateTree2(value.name);
            this.modelTree.forEach(ele=>{
                if(ele.name==value.name){
                    this.$set(ele,"state",1);
                }else{
                    this.$set(ele,"state",0);
                }
            });
            this.fetchSelectedTree1(this.modelTree);
            this.updateChangeState(this.getChangeState+1);
        }
    },
    watch:{
        getSelectedTree1:function(){
            this.modelTree=this.getSelectedTree1;
        }
    }

}
</script>

<style scoped>
.container{
    width:80%;
    height:100%;
    box-sizing: border-box;
    /* border:2px solid #000; */
    float:left;
}
.box1{
    width: 50%;
    height:35%;
    box-sizing: border-box;
    float:left;
    padding:5px 5px;
}
.box2{
    width: 50%;
    height:70%;
    box-sizing: border-box;
    float: right;
    padding:5px 5px;
}

.box3{
    width: 50%;
    height:50%;
    box-sizing: border-box;
    float:left;
    padding:5px 5px;
}

.box4{
    width: 50%;
    height:30%;
    box-sizing: border-box;
    float: right;
    padding:5px 5px;
}
.box3A4{
    width: 50%;
    height: 30%;
    box-sizing: border-box;
    float: left;
    padding: 5px 5px;
}
.content{
    width:100%;
}
</style>