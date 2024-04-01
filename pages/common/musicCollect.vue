<template>
	<view style="background-color: white;min-height: 100vh;">
		<view class="find-choise" style="margin-top: 20rpx;">
			<view class="choise-left">
				收藏列表
			</view>
		</view>
		<view class="find-style-list">
			<view class="style-item" v-for="(item, index) in songList" :key="index" >
				<image :src="filePath + item.musicLibrary.pic" mode=""></image>
				<view class="style-info">
					<view class="style-title" style="display: flex;align-items: center;">
						{{item.musicLibrary.name}}
						<text :class="'style-msg msg-bg'+item.musicLibrary.type" style="margin-left: 10rpx;">
							{{item.musicLibrary.type == 1?'MV':'音乐'}}
						</text>
					</view>
					<view class="u-tips-color" style="color: gray;">
						<!-- {{item.musicLibrary.nmSinger.singer}} -->
					</view>
				</view>
				<view class="style-icon">
					<text class="text-red cuIcon-playfill" @tap="goPlay(item.musicLibrary)"></text>
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
		},onLoad:function(){
			
			
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
				this.getData();
			}
		},methods:{
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
			getData(param){
				let _this = this;
				appRequest.request({
				  data: {
					  creater:this.userInfo.uid,
					  validFlag:1,
					  type:1
				  },
				  url: appRequest.urlMap.findNmMusicCollectList,
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
