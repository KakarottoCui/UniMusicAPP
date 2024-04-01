<template>
	<view style="background-color: white;min-height: 100vh;">
		<view class="video-card" v-if="articleData">
			<view class="card" style="align-items: flex-start;">
				<view style="padding-left: 30rpx; font-size: 35rpx;">
					<view>{{articleData.title}}</view>
				</view>
				
				<view style="padding: 30rpx 30rpx 0 30rpx;font-size: 30rpx;">
					{{articleData.content}}
				</view>
				
				<view style="display: flex;justify-content: flex-start;padding: 20rpx">
					<image style="width: 180rpx;height: 180rpx;" v-if="articleData.pic" :src="filePath + articleData.pic"></image>
					<image style="width: 180rpx;height: 180rpx;" v-if="articleData.pic2" :src="filePath +articleData.pic2"></image>
					<image style="width: 180rpx;height: 180rpx;" v-if="articleData.pic3" :src="filePath +articleData.pic3"></image>
				</view>
				
				<view class="card-comm" style="text-align: right; font-size: 20rpx;align-items: right;">
					{{articleData.createTime}}
				</view>
				
				<view class="card-bottom">
					<view class="card-bottom-left">
						<image class="card-bottom-image" :src="filePath+articleData.sysUser.pic" mode=""></image>
						<view class="card-bottom-name">
							{{articleData.sysUser.nickName}}
						</view>
					</view>
					<view class="card-bottom-right">
						<text class="card-bottom-icon text-gray cuIcon-appreciate" @click="collect()" ></text><text style="color: gray;font-size: 30rpx;">{{collectList.length}}</text>
						<text class="card-bottom-icon text-gray cuIcon-message" @click="show=true"></text><text style="color: gray;font-size: 30rpx;">{{commentList.length}}</text>
						
					</view>
				</view>
			</view>
		</view>
		
		<view style="background-color: white;border-top: 3px solid lightgray;padding: 20rpx;">
			<view @click="show=true" style="font-size: 40rpx;margin-bottom: 20rpx;">
				评论
			</view>
			
			<view v-for="(item,index) in commentList" style="box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);padding: 15rpx;margin-bottom: 15rpx;">
				<view >
					<view class="card-bottom">
						<view class="card-bottom-left">
							<image class="card-bottom-image" :src="filePath+(item.sysUser.pic||'nuoMi.png')" mode=""></image>
							<view class="card-bottom-name" style="font-size: 30rpx;">
								{{item.sysUser.nickName}}
							</view>
						</view>
					</view>
				</view>
				<view style="padding: 15rpx;">
					{{item.content}}
				</view>
				<view style="display: flex;justify-content: space-between;">
					<view style="text-align: right;color: gray;">
						{{index+1}}#
					</view>
					<view style="text-align: right;color: gray;">
						{{item.createTime}}
					</view>
				</view>
			</view>
			
		</view>
		<u-modal @confirm="subComment" v-model="show" title="评论" :show-cancel-button="true">
			<view class="slot-content">
				<view style="padding: 20rpx;">
					<u-input v-model="commentText" type="textarea" :border="true" height="100" :auto-height="true" />
					
				</view>
			</view>
		</u-modal>
		
		
	</view>
</template>

<script>
	import appRequest from "@/common/appRequestUrl.js"
	export default {
		data() {
			return {
				filePath:appRequest.urlMap.getFile,
				articleData:0,
				show:false,
				commentText:"",
				commentList:"",
				collectList:[],
				id:0,
				userInfo:false
			};
		},onLoad:function(option){
			this.id = option.id;
			this.getArticle(option.id);
			this.getComment(option.id);
			this.getCollectInfo();
		},onShow:function(){
			let user = appRequest.getUserInfo();
			if(!user.uid){
				uni.clearStorage()
				this.userInfo=false;
				uni.redirectTo({
					url:"/pages/common/login"
				})
			}else{
				this.userInfo = user;
			}
		},
		methods:{
			collect(){
				let id = this.userInfo.uid;
				let check = false;
				let his = {};
				for(let i=0;i<this.collectList.length;i++){
					if(id == this.collectList[i].creater){
						check = true;
						his = this.collectList[i];
					}
				}
				let param = {
					musicFk:this.articleData.id,
					type:0,
					validFlag:1
				}
				if(check){
					his.validFlag = 0;
					param = his;
				}
				let _this = this;
				appRequest.request({
				  data: param,
				  url: check ? appRequest.urlMap.editNmMusicCollect : appRequest.urlMap.addNmMusicCollect,
				  success: function(res) {
				    if (res.data.code == 200) {
						let text = "收藏成功"
						if(check){
							text ="取消收藏成功"
						}
				      _this.$api.msg(text);
					  _this.getCollectInfo();
					  
				    } else {
				      _this.$api.msg(res.data.msg);
				    }
				  },
				  fail: function(res) {
				   _this.$api.msg("网络异常");
				  }
				});
				
			},
			getCollectInfo(){
				let _this = this;
				appRequest.request({
				  data: {
				    musicFk:this.id,
					type:0,
					validFlag:1
				  },
				  url: appRequest.urlMap.findNmMusicCollectList,
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.collectList = res.data.data;
				    } else {
				      _this.$api.msg(res.data.msg);
				    }
				  },
				  fail: function(res) {
				   _this.$api.msg("网络异常");
				  }
				});
			},
			getComment(id){
				let _this = this;
				appRequest.request({
				  data: {
					type:0,
					parentFk:id,
					validFlag:1
				  },
				  url: appRequest.urlMap.findNmCommentList,
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.commentList = res.data.data;
				    } else {
				      _this.$api.msg(res.data.msg);
				    }
				  },
				  fail: function(res) {
				   _this.$api.msg("网络异常");
				  }
				});
			},
			subComment(){
				let _this = this;
				appRequest.request({
				  data: {
					type:0,
					parentFk:this.articleData.id,
					content:this.commentText
				  },
				  url: appRequest.urlMap.addNmComment,
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.commentText = "";
					  _this.show = false;
					  _this.getComment(_this.articleData.id);
				    } else {
				      _this.$api.msg(res.data.msg);
				    }
				  },
				  fail: function(res) {
				   _this.$api.msg("网络异常");
				  }
				});
			},
			getArticle(id){
				let _this = this;
				appRequest.request({
				  data: {
					id:id,
					validFLag:1
				  },
				  url: appRequest.urlMap.findNmArticleList,
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.articleData = res.data.data[0];
				    } else {
				      _this.$api.msg(res.data.msg);
				    }
				  },
				  fail: function(res) {
				   _this.$api.msg("网络异常");
				  }
				});
			},
		}
	}
</script>

<style lang="scss">
@import url("video.css");
.u-card-wrap { 
		background-color: $u-bg-color;
		padding: 1px;
	}
	
	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 10rpx;
	}
		
	.u-body-item image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
	}
</style>
