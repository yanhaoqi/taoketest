<template>
  <div class="loginRoot">
    <div class="loginWrap">
      <!--<img src="../../../static/images/login_logo.png" alt="">-->
      <Input v-model="loginUN" placeholder="请输入用户名" style="height:36px;margin-top:70px;"></Input>
      <Input v-model="loginPW" @on-enter="loginClick" placeholder="请输入密码" style="height:36px;margin-top:20px;" type="password"></Input>
      <!--<i-switch size="small" v-model="checked"></i-switch> 一天内免登陆-->
      <div style="text-align:center">
        <Button type="primary" size="large"  style="width:185px;height:50px;margin-top:60px;" @click="loginClick">立即登录</Button>
      </div>
    </div>
  </div>
</template>
<script>
  import http from '../../utils/http'
  export default {
    data(){
      return {
        loginUN:"adv",
        loginPW:"adv",
        checked:false
      }
    },
    mounted () {
      onhashchange = function () {
        if (location.hash == '#/login') {
          localStorage.removeItem('usr')
        }
      }
    },
    methods:{
      loginClick() {
        http.post('/login', {
          account: this.loginUN,
          password: this.loginPW
        }).then(d => {
          if (d.data.code == 0) {
            let token = d.data.data.token
            window.localStorage.setItem('token', token)
            localStorage.setItem('usr', this.loginUN)
            this.$emit('sendUsr')
            $router.push('/home')
          } else {
//            重新登录
            this.$Modal.error({
              title: '注意',
              content: '登录名或密码错误'
            })
            this.loginUN = ''
            this.loginPW = ''
          }
        })
      }
    }
  }
</script>

<style scope lang="less">
  .loginRoot{
    position: absolute;
    top:0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    /*background: url(../../../static/images/login_bg.png) center center ;*/
    background-color: #262a33!important;
  .loginWrap{
  img{
    width:350px;
  }
  position: absolute;
  width: 350px;
  height: 459px;
  top:0px;
  right: 0px;
  bottom: 0px;
  left:0px;
  margin: auto;
  border-radius: 5px;
  }
  }
</style>
