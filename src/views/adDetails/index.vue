<template>
  <section>
    <Row :gutter="16">
      <Col span="3" align="right">广告计划名称</Col>
      <Col span="12"><i-input v-model.trim="adName" :disabled="bothViewChangeNotEdit"></i-input></Col>
    </Row>
    <br><br>

    <Row :gutter="16">
      <Col span="3" align="right">广告资源选择</Col>
      <Col span="6"><i-select v-model="adSource" :disabled="bothViewChangeNotEdit"><Option v-for="item in adSources" :value="item.name" :key="item.name">{{item.name}}</Option></i-select></Col>
      <Col span="6"><i-select v-model="adSpaceType" @on-change="adSpaceTypeChange" :disabled="bothViewChangeNotEdit"><Option v-for="item in adSpaceTypes" :value="item.type" :key="item.name">{{item.name}}</Option></i-select></Col>
    </Row>
    <br><br>

    <Row :gutter="16">
      <Col span="3" align="right">推广类型</Col>
      <Col span="6"><i-select v-model="adType" :disabled="bothViewChangeNotEdit"><Option v-for="item in adTypes" :key="item.name" :value="item.type">{{item.name}}</Option></i-select></Col>
    </Row>
    <br><br>

    <Row :gutter="16">
      <Col span="3" align="right">落地页URL</Col>
      <Col span="12"><i-input v-model.trim="URL" :disabled="bothViewChangeNotEdit"></i-input></Col>
    </Row>
    <br><br>

    <Row :gutter="16">
      <Col span="3" align="right">投放开始时间</Col>
      <Col span="12" align="left">
        <DatePicker type="datetime" :disabled="onlyViewNotEdit" :options="dateStartOpt" v-model="startTime" format="yyyy-MM-dd HH:mm" placeholder="请选择投放开始时间" style="width: 200px"></DatePicker>
      </Col>
    </Row>
    <br><br>

    <Row :gutter="16">
      <Col span="3" align="right">投放结束时间</Col>
      <Col span="12" align="left">
        <DatePicker type="datetime" :disabled="onlyViewNotEdit" v-model="endTime" format="yyyy-MM-dd HH:mm" placeholder="请选择投放结束时间" style="width: 200px"></DatePicker>
      </Col>
    </Row>
    <br><br>

    <Row :gutter="16">
      <Col span="3" align="right">出价</Col>
      <Col span="6"><i-select v-model="bidType" :disabled="bothViewChangeNotEdit"><Option v-for="item in bidTypes" :value="item.type" :key="item.name">{{item.name}}</Option></i-select></Col>
      <Col span="6"><i-input v-model.trim="unitPrice" :disabled="onlyViewNotEdit"></i-input></Col>
      <Col span="1">元</Col>
    </Row>
    <br><br>

    <Row :gutter="16">
      <Col span="3" align="right">图片</Col>
      <Col span="12">
        <div class="demo-upload-list" v-for="item in uploadList">
          <template v-if="item.status === 'finished'">
            <img :src="item.response.data.img_url">
            <!--查看和删除的图标 如果后台没有删除图片的接口，就隐藏掉删除-->
            <div class="demo-upload-list-cover">
              <!--<Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>-->
              <!--服务器现在还不支持删除功能-->
              <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
            </div>
          </template>
          <template v-else>
            <!--进度条-->
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
        </div>
        <Upload
          v-show="(operateIfo.operateType == 0) && (uploadList.length < imageNumLimit)"
          ref="upload"
          :headers="headers"
          :show-upload-list="false"
          :default-file-list="defaultList"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          multiple
          type="drag"
          action="/upload-img"
          style="display: inline-block;width:118px;"
        >
          <div style="width:118px;height:118px;position:relative;">
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:100px;">
              <Icon type="camera" size="50"></Icon>
              <p>共需上传 <span style="font:bold 15px '微软雅黑';color:red;">{{imageNumLimit}}</span> 张图</p>
            </div>
          </div>
        </Upload>
        <!--<Modal title="View Image" v-model="visible">-->
          <!--<img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">-->
        <!--</Modal>-->
      </Col>
    </Row>
    <br><br>

    <Row :gutter="16" v-show="isTitleShow">
      <Col span="3" align="right">标题</Col>
      <Col span="12"><i-input v-model.trim="title"  :disabled="bothViewChangeNotEdit"></i-input></Col>
    </Row>
    <br><br>

    <Row :gutter="16" v-show="isTitleShow">
      <Col span="3" align="right">副标题</Col>
      <Col span="12"><i-input v-model.trim="subTitle" :disabled="bothViewChangeNotEdit"></i-input></Col>
    </Row>
    <br><br>

    <Row :gutter="16">
      <Col span="3" align="right" style="visibility: hidden">' '</Col>
      <Col span="8">
          <i-button style="margin-right: 16px;" @click="$router.push('/adplan')">取消</i-button>
          <i-button type="primary" @click="save" v-show="operateIfo.operateType != 1">保存</i-button>
      </Col>
    </Row>
    <br><br>
  </section>
</template>
<script>
  import http from '../../utils/http'
  export default {
    data () {
      return {
        checkImgNum: true,
        operateIfo: {},
        adName: '',
        adSources: [{name: '玩咖'}],
        adSource: '玩咖',
        adSpaceTypes: [{name: '通栏banner-图片', type: 1}, {name: '通栏banner-图文', type: 2}, {name: '插屏', type: 3}, {name: '开屏', type: 4}, {name: '信息流大图', type: 5}, {name: '信息流小图', type: 6}, {name: '信息流组图', type: 7}],
        adSpaceType: 1,
        adType: 1,
        adTypes: [{name: '链接推广', type: 1}],
        defaultList: [
//          {
//            'name': 'a42bdcc1178e62b4694c830f028db5c0',
//            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
//          },
//          {
//            'name': 'bc7521e033abdd1e92222d733590f104',
//            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
//          }
        ],
        imgName: '',
        visible: false,
        uploadList: [],
        URL: '',
        startTime: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
        endTime: new Date(),
        dateStartOpt: {
          disabledDate (date) {
            return date && date.valueOf() < (new Date().getTime() - 24 * 3600 * 1000)
          }
        },
        bidTypes: [{name: 'CPC', type: 1}],
        bidType: 1,
        unitPrice: '',
        title: '',
        subTitle: '',
        isTitleShow: false,
        imageNumLimit: 1,
//        只有查看时候不可编辑
        onlyViewNotEdit: false,
//        查看和编辑时候都不可编辑
        bothViewChangeNotEdit: false
      }
    },
    computed: {
      headers () {
        return {
          token: localStorage.getItem('token')
        }
      }
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList
      this.operateIfo = JSON.parse(localStorage.getItem('operateIfo'))
//      查看和编辑时候填充数据
      this.fillData()
    },
    methods: {
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove (file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      },
      handleSuccess (res, file, fileList) {
        console.log("this.uploadList", this.uploadList)
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '图片格式错误',
          desc: '图片' + file.name + '的正确格式应该为jpg、jpeg或png'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '图片过大',
          desc: file.name + '大小不能超过2M.'
        });
      },
      handleBeforeUpload () {
        this.checkImgNum = this.uploadList.length < this.imageNumLimit;
        if (!this.checkImgNum) {
          this.$Notice.warning({
            title: '图片数量过多'
          });
        }
        return this.checkImgNum;
      },
//      查看和编辑时候 初始化填充数据和是否可更改状态
      fillData () {
//        console.log('operateIfo----', this.operateIfo)
//        是否可更改状态
        if (this.operateIfo.operateType == 0) {
          this.onlyViewNotEdit = false
          this.bothViewChangeNotEdit = false
        } else if (this.operateIfo.operateType == 1) {
          this.onlyViewNotEdit = true
          this.bothViewChangeNotEdit = true
        } else if (this.operateIfo.operateType == 2) {
          this.onlyViewNotEdit = false
          this.bothViewChangeNotEdit = true
        }
//        填充数据
        if (this.operateIfo.operateType == 1 || this.operateIfo.operateType == 2) {
          http.post('/get-ad-plan', {
            id: this.operateIfo.detailIfo.id
          }).then(d => {
            console.log(d)
            if (d.data.code == 0) {
              this.adName = d.data.data.name
              this.adSpaceType = d.data.data.ad_space_type
              this.adType = d.data.data.ad_type
              this.URL = d.data.data.landing_url
              this.startTime = d.data.data.start_time
              this.endTime = d.data.data.end_time
              this.bidType = d.data.data.bid_type
              this.unitPrice = (+d.data.data.unit_price) / 100
//              console.log('before----', this.uploadList)
              if (d.data.data.img_url) {
                d.data.data.img_url.split(',').forEach(item => {
                  this.uploadList.push({response: {data: {img_url: item}},status: 'finished'})
                })
              }
//              console.log('after----', this.uploadList)
//              图片等接口出来再处理
              d.data.data.img_url ? '' : ''
              d.data.data.title ? this.title = d.data.data.title : ''
              d.data.data.subtitle ? this.subTitle = d.data.data.subtitle : ''
            } else {
              this.$Modal.error({
                title: '注意',
                content: d.data.msg
              })
            }
          })
        }
      },
//      广告资源选择改变
      adSpaceTypeChange () {
//        console.log(this.adSpaceType)
//        通栏图片 开屏 插屏
        if (this.adSpaceType == 1 || this.adSpaceType == 3 || this.adSpaceType == 4) {
          this.isTitleShow = false
          this.imageNumLimit = 1
        } else if (this.adSpaceType == 2 || this.adSpaceType == 5 || this.adSpaceType == 6) {
//        通栏图文 信息流小图 信息流大图
          this.isTitleShow = true
          this.imageNumLimit = 1
        } else if (this.adSpaceType == 7) {
          this.isTitleShow = true
          this.imageNumLimit = 3
        }
      },
      save () {
//          数据校验
        if (!this.adName) {
          this.$Modal.error({
            title: '注意',
            content: '广告计划名称不能为空'
          })
          return
        } else if (!this.URL) {
          this.$Modal.error({
            title: '注意',
            content: '落地页URL不能为空'
          })
          return
        } else if (!this.unitPrice) {
          this.$Modal.error({
            title: '注意',
            content: '出价不能为空'
          })
          return
        } else if (this.uploadList.length != this.imageNumLimit) {
          this.$Modal.error({
            title: '注意',
            content: '上传图片数量与要求不符'
          })
          return
        }
        if (this.isTitleShow) {
          if (!this.title) {
            this.$Modal.error({
              title: '注意',
              content: '标题不能为空'
            })
            return
          } else if (!this.subTitle) {
            this.$Modal.error({
              title: '注意',
              content: '副标题不能为空'
            })
            return
          }
        }
//        console.log('------', this.operateIfo)
//        operateIfo.operateType 0 新建 1 查看 2 修改
        let url = ''
        let opt = {}
        let successTxt = ''
        if (this.operateIfo.operateType == 0) {
          let imgArr = []
          imgArr = this.uploadList.map(item => {
            return item.response.data.img_url
          })
          url = '/save-ad-plan'
          opt.name = this.adName
          opt.ad_space_type = this.adSpaceType
          opt.ad_type = this.adType
          opt.landing_url = this.URL
          opt.start_time = this.startTime.toISOString().split('T')[0] + ' ' + this.startTime.getHours() + ':' + this.startTime.getMinutes() + ':' + this.startTime.getSeconds()
          opt.end_time = this.endTime.toISOString().split('T')[0] + ' ' + this.endTime.getHours() + ':' + this.endTime.getMinutes() + ':' + this.startTime.getSeconds()
          opt.bid_type = this.bidType
          opt.unit_price = (+this.unitPrice) * 100

          opt.img_url = imgArr

          if (this.isTitleShow) {
            opt.title = this.title
            opt.subtitle = this.subTitle
          }
          successTxt = '新建成功！'
        } else if (this.operateIfo.operateType == 2) {
          url = '/update-ad-plan'
          successTxt = '修改成功！'
//          目前只能修改这几项
          opt.id = this.operateIfo.detailIfo.id
          opt.start_time = this.startTime.toISOString().split('T')[0] + ' ' + this.startTime.getHours() + ':' + this.startTime.getMinutes() + ':' + this.startTime.getSeconds()
          opt.end_time = this.endTime.toISOString().split('T')[0] + ' ' + this.endTime.getHours() + ':' + this.endTime.getMinutes() + ':' + this.startTime.getSeconds()
          opt.unit_price = (+this.unitPrice) * 100
        }
        http.post(url,opt).then(d => {
          if (d.data.code == 0) {
            this.$Message.success(successTxt)
            $router.push('/adplan')
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
<style lang="less" scope>
  .demo-upload-list{
    display: inline-block;
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: 120px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 7px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
