<template>
  <section>
    <div class="header">
      <Button type="primary" @click="newAdPlan">新建广告计划</Button>
    </div>
    <div class="content">
      <Table  stripe :columns="columnArray" :data="dataArray"></Table>
    </div>
  </section>
</template>
<script>
  import http from '../../utils/http'
  export default{
    data () {
      return {
//        0 新建 1 查看 2 修改
        operateIfo:{
          operateType: 0,
          detailIfo: {}
        },
        columnArray: [
          {
            title: '广告计划名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '广告计划名称',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.viewPlan(params)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.changePlan(params)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
//                      console.log(params.row)
                      this.deletePlan(params)
                    }
                  }
                }, '删除')
              ])
            }
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            render: (h, params) => {
//              console.log('params.row', params.row)
              if (params.row.status == 1) {
                return h('Tag', {
                  props: {
                    type: 'dot',
                    color: 'yellow'
                  }
                }, '我方审核中')
              } else if (params.row.status == 2) {
                return h('Tag', {
                  props: {
                    type: 'dot',
                    color: 'red'
                  }
                }, '我方审核未通过')
              } else if (params.row.status == 3) {
                return h('Tag', {
                  props: {
                    color: 'yellow'
                  },
                  style: {
                    width: '120px'
                  }
                }, 'ADX审核中')
              } else if (params.row.status == 4) {
                return h('Tag', {
                  props: {
                    color: 'red'
                  },
                  style: {
                    width: '120px'
                  }
                }, 'ADX审核未通过')
              } else if (params.row.status == 5) {
                return h('div', [
                  h('Tag', {
                    props: {
                      type: 'dot',
                      color: 'green'
                    }
                  }, '投放中'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      shape: 'circle'
                    },
                    style: {
                      marginLeft: '1px'
                    },
                    on: {
                      click: () => {
                        this.changeLaunchType(params)
                      }
                    }
                  }, '暂停')
                ])
              } else if (params.row.status == 6) {
                return h('div', [
                  h('Tag', {
                    props: {
                      type: 'dot',
                      color: 'blue'
                    }
                  }, '已暂停'),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      shape: 'circle'
                    },
                    style: {
                      marginLeft: '1px'
                    },
                    on: {
                      click: () => {
                        this.changeLaunchType(params)
                      }
                    }
                  }, '开始')
                ])
              } else if (params.row.status == 7) {
                return h('Tag', {
                  props: {
                    type: 'dot',
                    color: '#EF6AFF'
                  }
                }, '已删除')
              }
            }
          }
        ],
        dataArray: []
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData () {
        http.post('/get-brief-ad-plan', {}).then(d => {
          if (d.data.code == 0) {
            this.dataArray = d.data.data
          } else {
            this.$Modal.error({
              title: '注意',
              content: d.data.msg
            })
          }
        })

//        this.dataArray = [
//          {id: 1, name: '建设银行', status: 1},
//          {id: 2, name: '农业银行', status: 2},
//          {id: 3, name: '浦发银行', status: 3},
//          {id: 4, name: '民生银行', status: 4},
////          投放中
//          {id: 5, name: '工商银行', status: 5},
////          已暂停
//          {id: 6, name: '上海银行', status: 6},
//          {id: 7, name: '天津银行', status: 7},
//          {id: 8, name: '北京银行', status: 5},
//          {id: 9, name: '华夏银行', status: 2},
//        ]
      },
//      新建广告计划
      newAdPlan () {
        this.operateIfo.operateType = 0
        localStorage.removeItem('operateIfo')
        localStorage.setItem('operateIfo', JSON.stringify(this.operateIfo))
//        this.$emit('newPlan', this.operateIfo)
        $router.push('/addetails')
      },
//      查看广告
      viewPlan (params) {
        this.operateIfo.operateType = 1
        this.operateIfo.detailIfo = params.row
        localStorage.removeItem('operateIfo')
        localStorage.setItem('operateIfo', JSON.stringify(this.operateIfo))
//        this.$emit('viewPlan', this.operateIfo)
        $router.push('/addetails')
      },
//      修改广告
      changePlan (params) {
        this.operateIfo.operateType = 2
        this.operateIfo.detailIfo = params.row
        localStorage.removeItem('operateIfo')
        localStorage.setItem('operateIfo', JSON.stringify(this.operateIfo))
//        this.$emit('changePlan', this.operateIfo)
        $router.push('/addetails')
      },
//      改变投放状态
      changeLaunchType (params) {
//        console.log('params', params)
        let opt = {}
        let successTxt = ''
        opt.id = params.row.id
        if (params.row.status == 5) {
//          暂停投放
          opt.status = 'off'
          successTxt = '已切换为暂停'
        } else if (params.row.status == 6) {
//          启动投放
          opt.status = 'on'
          successTxt = '已切换为开始'
        }
        http.post('/switch-ad-plan-status', opt).then(d => {
          if (d.data.code == 0) {
            this.$Message.success(successTxt)
//            重新渲染表格
            this.getData()
          } else {
            this.$Modal.error({
              title: '注意',
              content: d.data.msg
            })
          }
        })
      },
      deletePlan (params) {
        http.post('/delete-ad-plan', {id: params.row.id}).then(d => {
          if (d.data.code == 0) {
            this.$Message.success('删除成功')
            this.getData()
          } else {
            this.$Modal.error({
              title: '注意',
              content: d.data.msg
            })
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  section{
    .header{
      margin-bottom: 20px;
    }
  }
</style>
