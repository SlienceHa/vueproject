<template>
  <div id="app">
    <div class="container">
      <ControlPanel />
      <GraphPanel />
    </div>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';
import ControlPanel from './view/ControlPanel'
import GraphPanel from './view/GraphPanel'

export default {
  name: 'App',
  components: {
    ControlPanel,
    GraphPanel
  },
  methods:{...mapActions(["fetchTrees","fetchTree","fetchTreeId","fetchPersonInfo","fetchLocation",'fetchClusters','fetchFiltTrees','fetchSelectedTree1'])},
  created(){
    this.fetchFiltTrees();
    this.fetchTrees();
    this.fetchLocation();
    this.fetchClusters();

  }
//   mounted(){},
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
body {
  padding: 5px 5px 10px 5px;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.boxContent {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}
</style>
