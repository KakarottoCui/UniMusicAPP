<template>
	<view>
		<view class="warp">
			<u-form labelPosition="top" label-width="150" :model="form" ref="uForm">
				<u-form-item label-position="top" prop="title" borderBottom label="动态标题">
					<u-input v-model="form.title" placeholder="请输入动态标题"/>
				</u-form-item>
				<u-form-item label-position="top" prop="content" borderBottom label="动态内容">
					<u-input type="textarea" v-model="form.content" placeholder="请输入动态内容"/>
				</u-form-item>
				
				<view class="u-flex u-m-t-25 u-p-b-25 u-border-bottom" style="display: flex;">
					<view class="item">
						<ygy-upload-img title="图片1" :size="200" :num="1" :iconCloseStyle="info.iconCloseStyle"
							@saveImg="getImgList($event,'pic')"></ygy-upload-img>
					</view>
					<view class="item">
						<ygy-upload-img title="图片2" :size="200" :num="1" :iconCloseStyle="info.iconCloseStyle"
							@saveImg="getImgList($event,'pic2')"></ygy-upload-img>
					</view>
					<view class="item">
						<ygy-upload-img title="图片3" :size="200" :num="1" :iconCloseStyle="info.iconCloseStyle"
							@saveImg="getImgList($event,'pic3')"></ygy-upload-img>
					</view>
				</view>

			</u-form>
			<view class="buttonBox">
				<u-button type="primary" text="提交" @tap="sub()">提交</u-button>
				<view style="margin-top: 40rpx;"></view>
				<u-button @tap="back()" :plain="true"  type="primary" text="返回">返回</u-button>
			</view>
		</view>
		
		<!-- <picker @change="radioGroupChange" :value="index" :range="array">
			<view class="uni-input">{{parkInfo[index].name}}({{parkInfo[index].orgName}})</view>
		</picker> -->
		
	</view>
</template>

<script>
	import ygyUploadImg from '@/components/ygy-upload-img/ygy-upload-img.vue'
	import appRequest from "@/common/appRequestUrl.js"
	import base64 from "@/common/base64.js"
	export default {
		components: {
			ygyUploadImg
		},
		data() {
			return {
				array: [],
				index:0,
				parkInfo:[],
				selItem:{},
				form:{
					title:"",
					content:"",
					pic:"",
					pic2:"",
					pic3:""
				},
				show:true,
				info: {
					iconCloseStyle: { //关闭图标样式
						fontSize: '60rpx',
						color: "#f40"
					}
				}
			};
		},
		onLoad(){
			
		},
		methods:{
			back(){
				uni.redirectTo({
					url:"/pages/index/index"
				})
			},
			getImgList(arr, name) {
				this.form[name] = arr[0];
			},
			radioGroupChange(e){
				this.form.sex = e;
			},
			sub(){
				let _this = this;
				
				if(_this.form.title =="" || _this.form.content ==""){
					uni.showToast({
						title:"请填写完整",
						icon:"none"
					})
					
					return;
				}
				
				appRequest.request({
					method: "POST",
					data: _this.form,
					url: appRequest.urlMap.addNmArticle,
					success: function(res) {
						if(res.data.code == 200){
							uni.showModal({
								title:"信息",
								content:"发布成功！",
								showCancel:false,
								success:function(){
									uni.reLaunch({
										url:"/pages/index/index"
									})
								}
							})
						}else{
							uni.showModal({
								title:"信息",
								content:res.data.msg,
								showCancel:false,
								success:function(){
									
								}
							})
						}
						
					},
					fail: function(res) {
						console.log(res)
						_this.$api.msg("请求异常");
						// _this.logining = false;
						// _this.data.pass = "";
					}
				})
				
			},
			
		},onReady() {
			
		}
	}
</script>

<style lang="scss">
	.warp {
		width: 750rpx;
		padding: 160rpx 70rpx 30rpx 70rpx;
		background: #fff;
		
		.name {
			width: 100%;
			text-align: center;
			font-size: 38rpx;
			color: #3366FF;
			padding-bottom: 80rpx;
		}
		
		.u-form-item {
			padding-bottom: 50rpx;
		}
		
		.buttonBox {
			width: 100%;
			padding-top: 30rpx;
			
			.u-button {
				width: 100%;
			}
		}
	}
</style>
