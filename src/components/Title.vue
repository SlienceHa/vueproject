<template>
    <div class="title"  :style="{'height':height+'px'}">
            {{title}}
            <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'Title',
  props: ['title'],
  data () {
    return {
      height: this.$store.state.titleHeight
    }
  }
}
</script>
<style scoped>
.title{
    width:100%;
    background-color: gray;
    /* border:1px solid #ebebeb; */
    font-weight: bold;
    box-sizing: border-box;
    border: 1px solid #ccc;
    text-indent:10px;
    color:white;
}

.btnBox{
    height:100%;
    float:right;
}
.btnBox .btnGroup{
    width:auto;
    height:100%;
    border:1px solid #ccc;
    background-color: white;
    padding:2px 5px;
    border-radius:4px;
}

</style>
