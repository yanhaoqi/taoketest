<template>
  <div id="app">
    <!--header-->
    <div class="header" v-show="isLoginSuccess">
      <tedHeader @tellLogout="tellLogoutHandle"></tedHeader>
    </div>
    <!--主内容区-->
    <div :class="{mainWrapperLoginSuccess: !isLoginSuccess, mainWrapper: isLoginSuccess}">
      <div class="main">
        <!--<router-view @sendUsr="sendUsrHandle" @newPlan="newPlanHandle" @viewPlan="viewPlanHandle" @changePlan="changePlanHandle" :operateIfo="operateIfo"></router-view>-->
        <router-view @sendUsr="sendUsrHandle"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import tedHeader from './components/tedHeader/index.vue'
  export default {
    components: {
      tedHeader: tedHeader
    },
    data () {
      return {
        operateIfo: {
          operateType: 0,
          detailIfo: {}
        },
        usr: 'initUsr'
      }
    },
    mounted () {
      localStorage.getItem('usr') ? this.usr = localStorage.getItem('usr') : this.usr = ''
    },
    computed: {
//        如果登录成功 动态样式的flag为true 否则为false
      isLoginSuccess () {
        if (this.usr) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
//      newPlanHandle (operateIfo) {
//        this.operateIfo = operateIfo
//      },
//      viewPlanHandle (operateIfo) {
//        this.operateIfo = operateIfo
//      },
//      changePlanHandle (operateIfo) {
//        this.operateIfo = operateIfo
//      },
//      登录成功时候 赋值用户名

      sendUsrHandle () {
        this.usr = localStorage.getItem('usr')
      },
      tellLogoutHandle () {
        this.usr = ''
      }
    }
  }
</script>
<style lang="less" scoped>
  #app{
    width: 100%;
    height: 100%;
    .header{
      position: relative;
    }
    .mainWrapper{
      /*position: relative;*/
      margin-top: -60px;
      padding-top: 60px;
      width: 100%;
      height: 100%;
      background-color: #f8f8f9;
      .main{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 80px;
        bottom: 20px;
        width:1300px;
        background-color: #fff;
        border-radius: 10px;
        padding: 40px 55px;
        overflow: auto;
      }
    }
    .mainWrapperLoginSuccess{
      position: relative;
      background-color: #262a33;
      width: 100%;
      height: 100%;
      margin-top: 0;
      z-index: 99;
      .main{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 80px;
        bottom: 20px;
        width:1300px;
        background-color: #fff;
        border-radius: 10px;
        padding: 40px 55px;
        overflow: auto;
      }
    }
  }
</style>
