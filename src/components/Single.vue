<template>
    
    <div class="single" :style="{height:'100%',border:'0.5px solid gray',borderWidth:'0 0 0.5px 0'}">
        <div :style="{width:'19.35%',height:'96.5%',border:'0.01px solid gray',borderWidth:'0.5px 0.5px 0 0.5px',backgroundColor:'rgba(241,243,244)',float:'left',margin:'0 0px 0 0'}">
            
            <svg :style="{width:'100%',height:'100%'}">
                <circle :cx='xx' :cy="gap" :r="gap/4" stroke="black" stroke-width="1" fill="gray"/>
            </svg>
        </div>
        <div :style="{ width:'19.35%',height:'96.5%',border:'0.01px solid gray',borderWidth:'0.5px 0.5px 0 0.5px',float:'left',margin:'0 0px 0 0'}">
            <div   :style="{width:Age+'px',height:'100%',backgroundColor:'black'}"></div>

        </div>
        <div :style="{ width:'19.35%',height:'96.5%',border:'0.01px solid gray',borderWidth:'0.5px 0.5px 0 0.5px',backgroundColor:guan,float:'left',margin:'0 0px 0 0'}"></div>
        <div :style="{ width:'19.35%',height:'96.5%',border:'0.01px solid gray',borderWidth:'0.5px 0.5px 0 0.5px',backgroundColor:guan,float:'left',margin:'0 0px 0 0'}"></div>
        <div :style="{ width:'19.35%',height:'96.5%',border:'0.01px solid gray',borderWidth:'0.5px 0.5px 0 0.5px',backgroundColor:guan,float:'left',margin:'0 0px 0 0'}"></div>
    </div>
</template>
<script>
export default {
    name:'single',
    props:['width','height','data','gap','xx','guan','Age'],
    data(){
        return{
        }
    },
    methods:{
        render(){
            console.log(this.Age);
        }
    },
    created(){
        this.render();
    },
    watch:{
         getTree:function () {
            
            this.render();
        },

    }

}
</script>




<style scoped>


</style>