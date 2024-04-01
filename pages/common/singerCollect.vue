<template>
	<view class="" style="background-color: white;min-height: 100vh;">
		
		<view class="find-choise" style="margin-top: 20rpx;">
			<view class="choise-left">
				收藏列表
			</view>
		</view>
		<!-- choise list -->
		<view class="find-choise-list">
			<view v-for="(item, index) in singerList" :key="index" @tap="goSinger(item.singer)">
				<view class="choise-item"  >
					<image :src="filePath + item.singer.pic" mode="" ></image>
					<view class="choise-title">
						{{item.singer.singer}}
					</view>
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
				singerList:[],
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
			goSinger(item){
				uni.navigateTo({
					url:"/pages/common/musicList?id="+item.id
				})
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
			getData(param){
				let _this = this;
				appRequest.request({
				  data: {
					  creater:this.userInfo.uid,
					  validFlag:1,
					  type:2
				  },
				  url: appRequest.urlMap.findNmMusicCollectList,
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.singerList = res.data.data;
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
