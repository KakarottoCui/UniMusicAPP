<template>
	<view style="background-color: white;min-height: 100vh;">
		<view style="padding: 10upx;">
			<view v-if="showSinger" class="rowView">
				<image :src="filePath+singerData.pic"></image>
				<view style="color: gray; display: flex;flex-direction: column;justify-content: space-around;margin-left: 20rpx;">
					<view>{{singerData.singer}}</view>
					<view>{{singerData.country}}</view>
					<view class="info">{{singerData.introduction}}</view>
					<view>{{singerData.age+'岁'}}</view>
					<view style="display: flex;justify-content: space-between;">
						<view>曲风：{{singerData.style}}</view>
						<view @click="collect">
							<text class="text-gray cuIcon-favor" style="margin-right: 10rpx;"></text><text style="color: gray;font-size: 30rpx;">{{collectList.length}}</text>
						</view>
						
					</view>
					
				</view>
			</view>
		</view>
		
		
		<view class="find-choise" style="margin-top: 20rpx;">
			<view class="choise-left">
				作品列表
			</view>
		</view>
		<view class="find-style-list">
			<view class="style-item" v-for="(item, index) in songList" :key="index" >
				<image :src="filePath + item.pic" mode=""></image>
				<view class="style-info">
					<view class="style-title" style="display: flex;align-items: center;">
						{{item.name}}
						<text :class="'style-msg msg-bg'+item.type" style="margin-left: 10rpx;">
							{{item.type == 1?'MV':'音乐'}}
						</text>
					</view>
					<view class="u-tips-color" style="color: gray;">
						{{item.nmSinger.singer}}
					</view>
				</view>
				<view class="style-icon">
					<text class="text-red cuIcon-playfill" @tap="goPlay(item)"></text>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import appRequest from "@/common/appRequestUrl.js"
	export default {
		data() {
			return {
				filePath:appRequest.urlMap.getFile,
				showSinger:true,
				songList:[],
				collectList:[],
				singerData: {
				},
				collectList:[],
				id:0,
				userInfo:false
			};
		},onLoad:function(options){
			this.id = options.id;
			this.getData({validFlag:1,singerFk:options.id});
			this.getSinger(options.id);
			this.getCollectInfo()
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
					singerFk:this.singerData.id,
					type:2,
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
				    singerFk:this.id,
					type:2,
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
			goPlay(item){
				if(item.type == 0){
					uni.navigateTo({
						url: '/pages/play/play?id='+item.id
					})
				}else{
					uni.navigateTo({
						url: "/pages/common/videoPage?id=" + item.id
					})
				}
			},
			getSinger(id){
				let _this = this;
				appRequest.request({
				  data: {id:id},
				  url: appRequest.urlMap.findNmSingerList,
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.singerData = res.data.data[0];
				    } else {
				      _this.$api.msg(res.data.msg);
				    }
				  },
				  fail: function(res) {
				   _this.$api.msg("网络异常");
				  }
				});
			},
			getData(param){
				let _this = this;
				appRequest.request({
				  data: param,
				  url: appRequest.urlMap.findNmMusicLibraryList,
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.songList = res.data.data;
				    } else {
				      _this.$api.msg(res.data.msg);
				    }
				  },
				  fail: function(res) {
				   _this.$api.msg("网络异常");
				  }
				});
			}
		}
	}
</script>

<style lang="scss">
	@import url("./music.css");
	.rowView {
		display: flex;
	}
	image{
		width: 300upx;
		height: 300upx;
		border-radius: 10px;
		margin-left: 25upx;
	}
	.info{
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
	}
	.msg-bg0{
		background-color: $uni-color-success ;
	}
	.msg-bg1{
		background-color: $uni-color-primary !important;
	}
</style>