<template>
  <section>
    <div class="wrapper clearfix">
      <!--logo-->
      <div class="logo">
        <img src="../../assets/teddyimg/logo.png" alt="" height="40">
      </div>
      <!--导航-->
      <div class="navWrapper clearfix">
        <div class="navItem" v-for="item in navs" @click="$router.push(item.router)" :class="{routeClass: item.isRouteClass}">{{item.navName}}</div>
      </div>
      <!--登录-->
      <div class="titlebuttonwrap">
        <Menu mode="horizontal" :theme="'dark'" active-name="" @on-select="titleButtonHandler">
          <Submenu name="1">
            <template slot="title">
              <Icon type="person"></Icon>
              <div class="usr">{{username}} &nbsp;
                <!--<Icon type="chevron-down"></Icon>-->
              </div>
            </template>
            <MenuItem name="2-1">修改密码</MenuItem>
            <MenuItem name="2-2">退出登录</MenuItem>
          </Submenu>
        </Menu>
      </div>
    </div>
  </section>
</template>
<script>
  export default{
    data () {
      return {
        navs: [
          {
            navName: '首页',
            router: '/home',
            isRouteClass: false
          },
          {
            navName: '广告计划',
            router: '/adplan',
            isRouteClass: false
          }
        ],
        username: 'test11111111111'
      }
    },
//    刷新时候
    mounted () {
//      保存登录名的状态
      localStorage.getItem('usr') ? this.username = localStorage.getItem('usr') : this.username = ''
//      保存av的样式
      this.navs.forEach(item => {
        if (item.router == location.hash.split("#")[1]) {
          item.isRouteClass = true
        } else {
          item.isRouteClass = false
        }
      })
    },
    watch: {
      '$route' (to, from) {
//        1、hash改变时候nav的样式变化
        this.navs.forEach(item => {
          if (item.router == to.path) {
            item.isRouteClass = true
          } else {
            item.isRouteClass = false
          }
        })
//        2、显示登录名
        if (from.path == '/login') {
          this.username = localStorage.getItem('usr')
        }
      }
    },
    methods: {
      titleButtonHandler (name) {
        switch (name) {
          case "2-1":
            this.changePassword()
            break;
          case "2-2":
            this.logout()
            break;
        }
      },
      changePassword () {
        console.log('changePassword')
      },
      logout () {
        localStorage.removeItem('token')
        this.username = ''
        localStorage.removeItem('usr')
        this.$emit('tellLogout')
        $router.push('/login')
      }
    }
  }
</script>
<style lang="less" scoped>
  .wrapper{
    background-color: #495060;
    padding-right: 30px;
    height: 60px;
    .logo,.navWrapper{
      float: left;
    }
    .logo{
      padding: 10px 40px 0 40px;
    }
    .navWrapper{
      .navItem{
        height: 60px;
        line-height: 60px;
        float: left;
        color: #9ea7b4;
        font-size: 16px;
        padding: 0 20px;
        margin: 0 10px;
        &:hover{
           /*border-bottom: 2px solid #4984f0;*/
           color: #fff;
         }
      }
      .routeClass{
        border-bottom: 4px solid #4984f0;
        color: #fff;
      }
    }
    .titlebuttonwrap{
      float: right;
      .usr{
        width:95px;
        height:35px;
        color:#fff;
        display:inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
