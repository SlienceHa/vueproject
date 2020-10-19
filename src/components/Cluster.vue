<template>
    <div class="clusterBox">
        <div class="leftBox">
            <ClusterTree :svgId="'left'" v-for="value in representTree" :key="value.name" :padding="{top:30,left:20,}"
            :tree="value" :flag="0" :Height="'100%'" :Width="'100%'"/>
        </div>
        <div class="rightBox">
            <div class="topBox">
                <RectView :differentTypes="differentTypes"/>
            </div>
            <div class="bottomBox">
                <ClusterTree :svgId="'right'" v-for="value in differentTrees" :key="value.name" :tree="value" :flag="showIndex" :padding="{top:20,left:15,}"
                :Height="'100%'" :Width="'100%'"/>
            </div>
            
        </div>
    </div>
</template>

<script>
import ClusterTree from '../components/ClusterTree'
import RectView from '../components/RectView'
export default {
    name:'Cluster',
    components:{
        ClusterTree,
        RectView,
    },
    data(){
        return {
            showIndex:0,
        }
    },
    props:['representTree','differentTrees','differentTypes'],
    methods:{
        
    }
}
</script>

<style scoped>
.clusterBox{
    width:100%;
    height:100%;
}
.leftBox{
    height:100%;
    width:50%;
    float:left;
}
.rightBox{
    height:100%;
    width:50%;
    float:left;
    box-sizing: border-box;
    border-left:1.5px solid #3072ad;
    /* overflow: hidden auto; */
}
.topBox{
    width:100%;
    height:50%;
    box-sizing: border-box;
    border-bottom: 1.5px solid #3072ad;
}
.bottomBox{
    width:100%;
    height:50%;
}
</style>