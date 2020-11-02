import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
const state={
    trees:[],
    tree:{},
    tree2:{},//相似树
    treeId:"",
    choosedPeople:{},
    personInfo:{},
    location:[],
    choosedTrees:[],
    triFlag:false,
    titleHeight:25,
    choosedTreesByTreeEite:[],
    clusters:{},
    cluster:0,//当前选择的类
    representTree:[],//当前选择类的代表树
    differentTrees:[],//与当前类代表树有差异的树
    differentTypes:[],//保存当前类的细分类别数组
    chooseTypeIndex:0,//选择当前cluster的某个type
    personCount:0,//散点图人数过滤初始值
    filtCountTrees:[],
    Alltrees:[],
    selectedTree:[],//待选树
    selectedTree1:[],//待选树结构
    selectedModelTree: [{name:100000,children:[{name:1,children:[{name:2}]}]}],
    filtTrees:[],
    changeState:0,
};
const getters={
  getTrees:state=>state.trees,
  getTree:state=>state.tree,
  getTree2:state=>state.tree2,
  getTreeId:state=>state.treeId,
  getChoosedPeople:state=>state.choosedPeople,
  getPersonInfo:state=>state.personInfo,
  getLocation:state=>state.location,
  getChoosedTrees:state=>state.choosedTrees,
  getTriFlag:state=>state.triFlag,
  getTitleHeight:state=>state.titleHeight,
  getChoosedTreesByTreeEite:state=>state.choosedTreesByTreeEite,
  getClusters:state=>state.clusters,
  getCluster:state=>state.cluster,
  getRepresentTree:state=>state.representTree,
  getDifferentyTrees:state=>state.differentTrees,
  getDifferentTypes:state=>state.differentTypes,
  getChooseTypeIndex:state=>state.chooseTypeIndex,
  getPersonCount:state=>state.personCount,
  getFiltCountTrees:state=>state.filtCountTrees,
  getAlltrees:state=>state.Alltrees,
  getSelectedTree:state=>state.selectedTree,
  getSelectedTree1:state=>state.selectedTree1,
  getSelectedModelTree:state=>state.selectedModelTree,
  getFiltTrees:state=>state.filtTrees,
  getChangeState:state=>state.changeState,
};
const mutations={
  setTrees:(state,trees)=>(state.trees=trees),
  setTree:(state,tree)=>(state.tree=tree),
  setTree2:(state,tree)=>(state.tree2=tree),
  setTreeId:(state,treeId)=>(state.treeId=treeId), 
  setChoosedPeople:(state,choosedPeople)=>(state.choosedPeople=choosedPeople),
  setPersonInfo:(state,personInfo)=>(state.personInfo=personInfo),
  setLocation:(state,location)=>(state.location=location),
  setChoosedTrees:(state,trees)=>(state.choosedTrees=trees),
  setTriFlag:(state,flag)=>(state.triFlag=flag),
  setChoosedTreesByTreeEite:(state,trees)=>(state.choosedTreesByTreeEite=trees),
  setClusters:(state,clusters)=>(state.clusters=clusters),
  setCluster:(state,cluster)=>(state.cluster=cluster),
  setRepresentTree:(state,representTree)=>(state.representTree=representTree),
  setDifferentyTrees:(state,differentyTrees)=>(state.differentTrees=differentyTrees),
  setDifferentTypes:(state,types)=>(state.differentTypes=types),
  setChooseTypeIndex:(state,type)=>(state.chooseTypeIndex=type),
  setFiltCountTrees:(state,trees)=>(state.filtCountTrees=trees),
  setAlltrees:(state,allTrees)=>(state.Alltrees=allTrees),
  setSelectedTree:(state,selectedTree)=>(state.selectedTree=selectedTree),
  setSelectedTree1:(state,selectedTree1)=>(state.selectedTree1=selectedTree1),
  setSelectedModelTree:(state,selectedModelTree)=>(state.selectedModelTree=selectedModelTree),
  setFiltTrees:(state,filtTrees)=>(state.filtTrees=filtTrees),
  setChangeState:(state,changeState)=>(state.changeState=changeState)
};
const actions={
    fetchFiltTrees({commit}){
        axios.get("../static/att5.json").then(response=>{
            let treees=[];
            for(let i in response.data){
                let temp=response.data[i];
                temp.name=i;
                treees.push(temp);
            }
            commit("setFiltTrees",treees);
            console.log(treees);
        })
    },
    updateChangeState({commit},data){
        commit("setChangeState",data)
    },
    updateFiltTrees({commit},data){
        commit("setFiltTrees",data);
    },
    updateSelectedModelTree({commit},selectdModelTree){
        commit('setSelectedModelTree',selectdModelTree);
    },
    fetchSelectedTree1({commit},selectedTree1){
        commit('setSelectedTree1',selectedTree1);
    },
    fetchSelectedTree({commit},selectedTree){
        commit('setSelectedTree',selectedTree);
    },
  fetchTrees({ commit }){
    axios.get(
      '../static/trees4.json'
    )
    .then(response=>{
      commit("setTrees",response.data);
      
      let ii=916;
      // for(var i=0;i<response.data.length;i++){
      //   if(response.data[i].deepth==8){
      //     ii=i;
          
      //     console.log(ii);
      //   }
      // }
      commit("setTreeId",response.data[ii].name);
      commit("setTree",response.data[ii]);
      commit("setTree2",response.data[ii]);
      let trees=[];
      for(let i=0;i<response.data.length;i++){
        if(response.data[i].count>=state.personCount){
          trees.push(response.data[i]);
        }
      }
      commit("setFiltCountTrees",trees);

    })
    
      
    },

  fetchTree({commit},treeId){

    commit("setTreeId",treeId);

    for(var i=0;i<state.trees.length;i++){
      if(state.trees[i].name==treeId){
        commit("setTree",state.trees[i]);
      }
    }
    
  },

  fetchChoosedPeople({commit},personId){
    var person=state.personInfo[personId];
    commit("setChoosedPeople",person);
  },

  fetchPersonInfo({ commit }){
    console.log("personInfo")
    axios.get(
      '../static/personInfo2.json'
    )
    .then(response=>{
      console.log(response.data)
      commit("setPersonInfo",response.data);
    })
    .catch(err=>console.log(err))
  },

  fetchLocation({ commit }){
    axios.get(
      '../static/locationAll.json'
    )
    .then(response=>{
      commit("setLocation",response.data);
    })
  },
  updateLocation({commit},selected){
    axios.get(
        '../static/location'+selected+'.json'
    )
    .then(response=>{
        commit('setLocation',response.data)
    })
  },
  fetchClusters({commit}){
    axios.get(
      '../static/Clusters.json'
    )
    .then(response=>{
      commit('setClusters',response.data);
    })
  },

  updateChoosedTrees({ commit },rootsIds){
    let trees=[];
    for(var j=0;j<rootsIds.length;j++){
      for(var i=0;i<state.trees.length;i++){
        if(state.trees[i].name==rootsIds[j]){
          trees.push(state.trees[i]);
          continue;
        }
      }
    }
    commit("setChoosedTrees",trees);
  },
  

  updateChoosedTreesByTreeEite({commit},rootsIds){
    let trees=[];
    for(var j=0;j<rootsIds.length;j++){
      for(var i=0;i<state.trees.length;i++){
        if(state.trees[i].name==rootsIds[j]){
          trees.push(state.trees[i]);
          continue;
        }
      }
    }
    commit("setChoosedTreesByTreeEite",trees);
  },

  updateTriFlag({ commit },flag){
    
    commit("setTriFlag",flag);
  },

  updateCluster({commit},cluster){
    commit("setCluster",cluster);
  },

  updateRepresentTree({commit},representTree){
    for(var i=0;i<state.trees.length;i++){
      if(state.trees[i].name==representTree){
        commit("setRepresentTree",[state.trees[i]]);
        console.log(state.trees[i]);
        break;
      }
    }
    commit("setAlltrees",state.trees);
  },
  updateDifferentyTrees({commit},differentyId){
    let trees=[];
    
      for(var i=0;i<state.trees.length;i++){
        if(state.trees[i].name==differentyId){
          trees.push(state.trees[i]);
          continue;
        }
      }
    commit("setDifferentyTrees",trees);
  },

  updateDifferentTypes({commit},types){
    commit("setDifferentTypes",types);
  },

  updateChooseTypeIndex({commit},type){
    commit("setChooseTypeIndex",type);
  },

  updateTree2({commit},treeId){
    for(var i=0;i<state.trees.length;i++){
      if(state.trees[i].name==treeId){
        commit("setTree2",state.trees[i]);
      }
    }
  },

  updateFiltCountTrees({commit},count){
    let trees=[];
    for(let i in state.trees){
      if(state.trees[i].count>=parseInt(count)){
        trees.push(state.trees[i]);
      }
    }
    commit("setFiltCountTrees",trees);
  },
  
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})