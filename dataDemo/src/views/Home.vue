<script lang="ts">
import Right from "../components/Right.vue";
import Main from "../components/Main.vue";
import Left from "../components/Left.vue";

export default {
    setup() {
        return {};
    },
    components: { Right, Main, Left }
}
</script>

<template>
   <div class="header">
   </div>
   <div class="main">
    <div class="left">
        <Left></Left>
    </div>
    <div class="middle">
        <Main></Main>
    </div>
    <div class="right">
        <Right />
    </div>
   </div>
</template>

<style>
.header{
    height: 15%;
    background-image: url('../pic/logo.png');
    background-size: cover;
}
.main{
    display: flex;
    width: 100%;
    height: 100%;
}
.left{
    display: flex;
    flex-direction: column;
    /* margin-top: -20px; */
    margin: -20px 20px 0px 20px;
    width: 30%;
    height: 100%;
}
.right{
    display: flex;
    flex-direction: column;
    /* margin-top: -20px; */
    margin: -20px 20px 0px 20px;
    width:30%;
    height: 100%;
}
.middle{
    /* flex: 1; */
    display: flex;
    margin: -20px 20px 0px 20px;
    flex-direction: column;
    width: 40%;
    /* margin-top: 20px; */
    height: 100%;
    /* background-color: aqua; */
}
</style>