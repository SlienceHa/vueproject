
<template>
    <div class="container">
        <div class="allTrees">
            <div class="boxContent">
                <Title :title="'Overview'"/>
                <!-- <div class="parameterName">Number:</div>
                <el-slider v-model="personCount" :show-tooltip="false" :max='200' :min='0'  :step='1' class="sliderStyle"
                    show-input :show-input-controls='false' :key="0" @change="filtCount"
                    :marks="guideMarks">
                ></el-slider> -->
                <div style="width:100%;height:98%">
                    <ScatterPlot :trees="this.getFiltTrees"></ScatterPlot>
                </div>
            </div>
        </div>
         <div class="Info">
            <div class="boxContent">
                <Title  :title="'AttributePanel'">
                  </Title>
                  <div class="content" :style="{'height':'calc(100% - '+height+'px)'}" >
                    <div class="sliderBox">
                        <div class="parameterName">
                            <el-checkbox v-model="checkIf.ageGap" style="marginLeft:-20px;">AgeGap:</el-checkbox>
                        </div>
                        <el-slider v-model="checkValue.ageGap"   :max="60" :min='0' class="sliderStyle"  :marks="{  0:'0',60:'60',label: this.$createElement('strong', '30%')}">
                        </el-slider>
                       <span style="position:absolute;left:16.5%;top:28.5%;height:25px;color:white;backgroundColor:gray;">{{checkValue.ageGap}}</span>
                    </div>
                    <div class="sliderBox">
                        <div class="parameterName">
                             <el-checkbox v-model="checkIf.averageAge"  style="marginLeft:-20px" >AverageAge:</el-checkbox>
                        </div>
                       <el-slider v-model="checkValue.averageAge"  :max="151" :min="0" class="sliderStyle" :marks="{  0:'0',151:'151',label: this.$createElement('strong', '30%')} "></el-slider>
                        <span style="position:absolute;left:16.5%;top:31.7%;height:25px;color:white;backgroundColor:gray;">{{checkValue.averageAge}}</span>

                    </div>
                    <div class="sliderBox">
                        <div class="parameterName">
                             <el-checkbox v-model="checkIf.positionNum"  style="marginLeft:-20px" >PositionNum:</el-checkbox>
                        </div>
                        <el-slider v-model="checkValue.positionNum" show-stops :max="20" :min="0" class="sliderStyle" :marks="{  0:'0',20:'20',label: this.$createElement('strong', '30%')}" ></el-slider>
                       <span style="position:absolute;left:16.5%;top:35%;height:25px;color:white;backgroundColor:gray;">{{checkValue.positionNum}}</span>
                    </div>
                    <div class="sliderBox">
                        <div class="parameterName">
                             <el-checkbox v-model="checkIf.timeSpan"  style="marginLeft:-20px">TimeSpan:</el-checkbox>
                        </div>
                       <el-slider v-model="checkValue.timeSpan"   :max="300" :min="0" class="sliderStyle"  :marks="{  0:'0',300:'300',label: this.$createElement('strong', '30%')}" ></el-slider>
                        <span style="position:absolute;left:16.5%;top:38.2%;height:25px;color:white;backgroundColor:gray;">{{checkValue.timeSpan}}</span>
                    </div> 
                    <div class="sliderBox">
                        <div class="parameterName">
                             <el-checkbox v-model="checkIf.villageNum" style="marginLeft:-20px" >VillageNum:</el-checkbox>
                        </div>
                       <el-slider v-model="checkValue.villageNum"  show-stops :max="31" :min="0" class="sliderStyle" :marks="{  0:'0',31:'31',label: this.$createElement('strong', '30%')}" ></el-slider>
                       <span style="position:absolute;left:16.5%;top:41.5%;height:25px;color:white;backgroundColor:gray;">{{checkValue.villageNum}}</span>
                    </div>
                     <div class="sliderBox">
                        <div class="parameterName">TimeIntersection:</div>
                       <el-slider v-model="checkValue.TimeIntersection" range :max="200" :min="0" class="sliderStyle" :marks="{  0:'0',200:'200',label: this.$createElement('strong', '30%')}"></el-slider>
                       <span style="position:absolute;left:16.5%;top:45.5%;height:25px;color:white;backgroundColor:gray;">{{checkValue.TimeIntersection[0]}}~{{checkValue.TimeIntersection[1]}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="modelBox">
            <div class="boxContent">
                <Title  :title="'StructurePanel'"/>
                <div class="content" :style="{'height':'calc(100% - '+height+'px)'}" >
                    <div class="btnBox" :style="{'height':'calc(15% - 10px)'}">
                        <input type="button" value="" class="btnGroup Node" title="draw node" >
                        <input type="button" value="" class="btnGroup Line" title="draw line">
                        <input type="button" value="" class="btnGroup UnDo" title="Undo" @click="undoClick">
                        <input type="button" value="" class="btnGroup ReDo" title="Redo"  @click="redrawClick">
                        <input type="button" value="" class="btnGroup Search" title="Search" @click="searchClick"> 
                    </div>
                    <div :style="{'width':'100%','height':'60%'}">
                        <DrawPanel ref="DrawPanel"/>
                    </div>
                    <div class="allModels" :style="{'width':'97.5%','height':'23%','boxSing':'borderBox','border':'1px solid #ccc','margin':'5px 5px 5px 5px','overflowX':'scroll','overflowY':'hidden'}">
                        <ul :style="{'width':115*modelData.length+'px','height':'100%',textalgin:'center',padding:'5px'}">
                            <li class="model" v-for="(value,index) in modelData" :key="index"  @click="ModelTreeClick(value)"  style="width:107px; text-align:center;border:1px solid steelblue;margin:0 5px 0 0;height:90%">
                                <ModelTree :indexx="index" :tree="value" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="Info" style="height:6%">
            <div class="boxContent">
                <Title  :title="'ConfirmPanel'"></Title>
                  <div class="content" :style="{'height':'calc(100% - '+height+'px)'}" >
                     <div class="sliderBox" style="padding:0px">
                        <div class="parameterName">confirm:</div>
                         <el-checkbox-group v-model="checkList"  size="small" style="width:64%;
                            float:left;
                            box-sizing:border-box;
                            margin:0 5px;
                            padding-top:10px;
                            "
                            >
                            <el-checkbox label="Structure"></el-checkbox>
                            <el-checkbox label="Attribute"></el-checkbox>
                            <el-button size="mini" style="margin-left:10px;" @click="selectedConfirm()">confirm</el-button>
                        </el-checkbox-group>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Title from '../components/Title'
import {mapGetters,mapActions} from "vuex"
import ScatterPlot from '../components/ScatterPlot'
import DrawPanel from "../components/DrawPanel";
import ModelTree from '../components/ModelTree';
import modelData from '../assets/modelData'
const cityOptions = ['Structure','positionNum', 'averageAge', 'villageNum', 'timeSpan','ageGap'];
export default {
  name: 'ControlPanel',
  components: {
    DrawPanel,
    Title,
    ScatterPlot,
    ModelTree,
  },
  data(){
      return{
            height:this.$store.state.titleHeight,
            modelData:modelData,
            trainEpochs:200,
            vectorSize:128,
            inferEpochs:100,
            personCount:this.getPersonCount,
            isFirst:true,
            guideMarks:{
                0:'0',
                200:'200',
                label: this.$createElement('strong', '50%')
            },
            marks:{
                20:'20',
                300:'300',
                label: this.$createElement('strong', '50%')
            },
            checkAll: false,
            cities: cityOptions,
            isIndeterminate: true,
            checkList: ['Structure'],
            checkValue:{
                'ageGap':10,
                'averageAge':20,
                'positionNum':30,
                'timeSpan':40,
                'villageNum':0,
                'TimeIntersection':[50,100],
            },
            checkIf:{
                'ageGap':false,
                'averageAge':false,
                'positionNum':false,
                'timeSpan':false,
                'villageNum':false,
            },
            structure:true,
            origin:0,
      };
  },
  computed:{...mapGetters(["getTreeId","getTrees","getTree","getPersonCount",'getFiltCountTrees','getChoosedTrees','getFiltTrees'])},
  methods:{
        ...mapActions(["fetchTree","updateFilters","updateChoosedTrees","updateTriFlag","updateFiltCountTrees",'updateLocation','fetchSelectedTree','fetchSelectedTree1','updateFiltTrees','updateLocation','updateNowGra']),
        filt(){
            // this.updateFilters(Number(this.$refs.filterGeneration.value),Number(this.$refs.filterCount.value));
            var choosedTrees=[]
            if(this.$refs.filterCount.value==""){
                for(var i=0;i<this.getTrees.length;i++){
                    if(this.getTrees[i].deepth==Number(this.$refs.filterGeneration.value))
                    {
                        choosedTrees.push(this.getTrees[i].name);
                    }
                }
            }
            else if(this.$refs.filterCount.value!=""&&this.$refs.filterGeneration.value!=""){
                for(var i=0;i<this.getTrees.length;i++){
                    if(this.getTrees[i].deepth==Number(this.$refs.filterGeneration.value)&&
                    this.getTrees[i].count==Number(this.$refs.filterCount.value))
                    {
                        choosedTrees.push(this.getTrees[i].name);
                    }
                }
            }
            else{
                for(var i=0;i<this.getTrees.length;i++){
                    if(this.getTrees[i].count==Number(this.$refs.filterCount.value))
                    {
                        choosedTrees.push(this.getTrees[i].name);
                    }
                }
            }
            
            this.updateChoosedTrees(choosedTrees);
            //初始默认
            var sel=[]
            choosedTrees.forEach(ele=>{
                this.getTrees.forEach(eles=>{
                    if(eles.name==ele)
                    {
                        sel.push(eles);
                    }
                })
            })
            this.fetchSelectedTree1(sel);
            console.log("211111");
        },
        // filtTrees(){        //废除该函数
        //     //设置与保存初始所有树
        //     var trees=this.origin;
        //     var finalTrees=[];
        //     if(this.origin==0){
        //         this.origin=this.getFiltTrees;
        //         trees=this.origin;
        //     }
        //     let treess = this.getTrees;
        //     trees.forEach((ele)=>{
        //         if(ele.ageGap>=this.checkValue.ageGap[0] && ele.ageGap<=this.checkValue.ageGap[1] &&
        //             ele.averageAge>=this.checkValue.averageAge[0] && ele.averageAge<=this.checkValue.averageAge[1] &&
        //             ele.positionNum>=this.checkValue.positionNum[0] && ele.positionNum<=this.checkValue.positionNum[1] &&
        //             ele.timeSpan>=this.checkValue.timeSpan[0] && ele.timeSpan<=this.checkValue.timeSpan[1] &&
        //             ele.villageNum>=this.checkValue.villageNum[0] && ele.villageNum<=this.checkValue.villageNum[1]
        //         )
        //         finalTrees.push(ele);
        //     });
        //     console.log(finalTrees);
        //     this.updateFiltTrees(finalTrees);
        //     console.log(this.getFiltTrees);
        // },
        filtCount(){
            this.updateFiltCountTrees(this.personCount);
        },
        become(){
            this.updateTriFlag(true);
        },
        updateTree(name){
            this.fetchTree(name);
            this.updateTriFlag(false);
        },
        searchClick(){
            this.$refs.DrawPanel.search();
        },
        pipeiClick(){
            this.$refs.DrawPanel.pipei();
        },
        redrawClick(){
            this.$refs.DrawPanel.redraw();
        },
        undoClick(){
            this.$refs.DrawPanel.undo();
        },
        searchClickByTreeEdit(){
            this.$refs.DrawPanel.searchByTreeAndVector();
        },
        ModelTreeClick(tree,treeId){//选择模板树
            if(!treeId){
                treeId=-1;
            }
            this.$refs.DrawPanel.redraw();
            this.$refs.DrawPanel.drawTree(tree,treeId);
            let links=this.getLinks(tree,[]);
            let nodes=this.getNodes(tree,[]);
            let becomeData=this.becomeId(nodes,links);

            this.$refs.DrawPanel.linkList=becomeData.links
            this.$refs.DrawPanel.nodeList=becomeData.nodes;
            this.$refs.DrawPanel.index=nodes[nodes.length-1]+1;
        },
        getNodes(tree,nodelist){//获得选择的模板树节点id
            nodelist.push(tree.name);
            if(tree.children){
                for(let i=0;i<tree.children.length;i++){
                    this.getNodes(tree.children[i],nodelist);
                }
            }
            return nodelist;
        },
        getLinks(tree,linklist){//获得选择的模板树连线
            if(tree.children){
                for(let i=0;i<tree.children.length;i++){
                    linklist.push([tree.name,tree.children[i].name])
                    this.getLinks(tree.children[i],linklist);
                }
            }
            return linklist;
        },
        becomeId(nodes,links){
            let dic={};
            for(let i=0;i<nodes.length;i++){
                dic[nodes[i]]=i;
                nodes[i]=i;
            }
            for(let i=0;i<links.length;i++){
                links[i][0]=dic[links[i][0]];
                links[i][1]=dic[links[i][1]];
            }
            return {'links':links,'nodes':nodes};
        },
        handleCheckAllChange(val) {
            this.checkedCities = val ? cityOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        async selectedConfirm(){
            //属性规定
            // const reTree = {name:'0',...this.checkValue};
            const reTree = [];
            var params = []
            for (var i in this.checkIf){
                if(this.checkIf[i]===true){
                    reTree.push([i,this.checkValue[i]]);
                }
            }
            //分3种情况分别做处理
            if(this.checkList[0]=='Structure' && this.checkList.length==1){
                console.log("Structure");
             
            }else if(this.checkList[0]=='Attribute' && this.checkList.length==1){
                console.log("Attribute");
                // const res = await this.$axios.post('http://localhost:5000/api/attr',{
                //     'data':reTree,
                // });
                this.updateLocation('New');  
                this.updateNowGra("New");
               
            }else if(this.checkList.length==0){
                this.$message({
                    message: '您必须至少选择一种方式',
                    type: 'warning'
                });

            }
            else{
                console.log("Structure And Attribute");
                const treeInfo=require("../../static/att5.json");
            }          

        },
        // checkifif(){ //函数废除
        //     let fileName= this.structure==true?"location":"ATTR" ;
        //     for(let i in this.checkIf){
        //         if(this.checkIf[i]==true){
        //             fileName+=i;
        //         }
        //     }
        //     if(fileName=="location"){
        //         fileName="All"
        //     }
        //     console.log(fileName);
        //     this.updateLocation(fileName);

        // }
    },
    watch:{
        getTree:function(){
            this.ModelTreeClick(this.getTree,this.getTree.name);
            if(this.isFirst){
                this.searchClick();
                this.isFirst=false;
            };
            // var agegap=0;
            // var averageAge=0;
            // var positionNum=0;
            // var timeSpan=0;
            // var villageNum=0;
            // for(let index in treeInfo){
            //     // console.log(treeInfo[index]);
            //     if(treeInfo[index]['ageGap']>agegap)
            //         agegap=treeInfo[index]['ageGap'];
            //     if(treeInfo[index]['averageAge']>averageAge)
            //         averageAge=treeInfo[index]['averageAge'];
            //     if(treeInfo[index]['positionNum']>positionNum)
            //         positionNum=treeInfo[index]['positionNum'];
            //     if(treeInfo[index]['timeSpan']>timeSpan)
            //         timeSpan=treeInfo[index]['timeSpan'];
            //     if(treeInfo[index]['villageNum']>villageNum)
            //         villageNum=treeInfo[index]['villageNum'];
            // }
            // console.log(agegap);
            // console.log(averageAge);
            // console.log(positionNum);
            // console.log(timeSpan);
            // console.log(villageNum);
        },
    }
}
</script>
<style scoped>
    .container{
        width: 20%;
        height: 100%;
        box-sizing: border-box;
        border-right:none;
        float:left;
    }
    .Info{
        width: 100%;
        height: 24%;
        box-sizing: border-box;
        padding: 5px 5px;
    }
    .allTrees{
        width: 100%;
        height: 25%;
        box-sizing: border-box;
        padding: 5px 5px;
    }
    .modelBox{
        width: 100%;
        height: 45%;
         box-sizing: border-box;
        padding: 5px 5px;
    }
    .content{
        width:100%;
    }
    .allModels ul{
        list-style: none;
    }
    .parameterName{
    width:30%;
    float:left;
    text-indent:10px;
    line-height: 200%;
    }
    .sliderStyle{
        width:65%;
        float:left;
        box-sizing:border-box;
        margin:0 7px;
    }
    .sliderBox{
        width:100%;
        height:16%;
    }
    .model{
        height:100%;
        /* border-right:1px solid #ccc; */
        box-sizing: border-box;
        float:left;
    }
    .btnBox{
    border:1px solid #ccc;
    padding:5px 5px;
    box-sizing: border-box;
    margin:5px 5px;
    }
    .btnBox .btnGroup{
        width:auto;
        height:100%;
        border:1px solid #3072ad;
        background-color: white;
        padding:2px 5px;
        border-radius:4px;
        margin-right:5px;
        cursor: pointer;
    }
    .btnBox .ReDo{
        width:80px;
        background-image: url('../assets/redo.png');
        background-position: center center;
         background-repeat: no-repeat;
         margin: 0 0 0 5px;
        
    }
    .btnBox .UnDo{
        width:80px;
        background-image: url('../assets/undo.png');
        background-position: center center;
         background-repeat: no-repeat;
          margin: 0 0 0 5px;
    }
    .btnBox .Node{
        width:80px;
        background-image: url('../assets/node.png');
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 60%;
         margin: 0 0 0 5px;
    }
    .btnBox .Line{
        width:80px;
        background-image: url('../assets/line.png');
        background-position: center center;
         background-repeat: no-repeat;
          margin: 0 0 0 5px;
    }
    .btnBox .Search{
        width:80px;
        background-image: url('../assets/search.png');
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 80%;
         margin: 0 0 0 5px;
    }
    .btns{
        width:auto;
        height:28px;
        background:white;
        border:1px solid #ccc;
        border-radius: 4px;
        line-height: 25px;
        padding:3px 5px;
        position:relative;
        bottom:5px;
        left:10px;
    }


</style>
<style>
.el-slider__input {
    float: right;
    margin-top: 3px;
    width: 80px !important;
}
.el-slider__runway {
    margin-right: 100px !important;
    width: auto;
}
</style>
