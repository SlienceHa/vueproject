<template>
    <div class="compareBox">
        <!-- <Ctree v-for="(value,index) in choosedTrees" :key="value.name" :tree="value" :flag="showIndex" :index="index" 
        :Height="'100%'" :Width="'100%'"/> -->
        <!-- <Tree :svgId="'sim'" v-for="value in currentTree" :key="value.name" :getTree="value"/> -->
        <Tree :svgId="'sim'" :getTree="currentTree"/>
    </div>
</template>

<script>
import Ctree from './Ctree'
import Tree from './Tree'
export default {
    name:"Compare",
    components:{
        Ctree,
        Tree,
    },
    props:['choosedTrees','Tree'],
    data(){
        return {
            currentTree:this.Tree,
            showIndex:0,
        }
    },
    methods:{
        nextOne(){
            this.showIndex<this.choosedTrees.length-1?this.showIndex++:alert("已经到最后了！！！");
        },
        lastOne(){
            this.showIndex>1?this.showIndex--:alert("已经到第一个了！！！");
        }
    },
    watch:{
        choosedTrees(){
            this.currentTree=this.choosedTrees[0];
        }
    }
}
</script>

<style scoped>
.compareBox{
    width:100%;
    height:100%;
    box-sizing: border-box;
    border:1px solid #ccc;
    position: relative;
    overflow: hidden;
}
</style>