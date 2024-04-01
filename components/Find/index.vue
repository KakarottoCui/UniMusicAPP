<template name="Find">
	<view class="find">
		<!-- swiper -->
		<swiper 
		class="find-swiper"
		:indicator-dots="false" 
		:autoplay="true" 
		:interval="3000" 
		:duration="1000"
		circular="true"
		vertical="true"
		>
			<swiper-item 
			v-for="(item, index) in swpierList" 
			:key="index"
			>
				<image :src="filePath+item.pic" mode="" ></image>
			</swiper-item>
		</swiper>
		<!-- category -->
		<view class="find-category">
			
		</view>
		
		<view class="find-recommend">
			音乐推荐
		</view>
		<view class="find-choise">
			<view class="choise-left">
				聆听华语佳曲
			</view>
			<view class="choise-right">
				查看更多
			</view>
		</view>
		<view class="find-style-list">
			<view class="style-item" v-for="(item, index) in songList" :key="index">
				<image :src="filePath + item.pic" mode=""></image>
				<view class="style-info">
					<view class="style-title" style="display: flex;align-items: center;">
						{{item.name}}
						<text class="style-msg" style="margin-left: 10rpx;">
							音乐
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
		
		
		<!-- more choise -->
		<view class="find-recommend">
			歌手推荐
		</view>
		<view class="find-choise">
			<view class="choise-left">
				为你精挑细选
			</view>
			<!-- <view class="choise-right">
				查看更多
			</view> -->
		</view>
		<!-- choise list -->
		<view class="find-choise-list">
			<view v-for="(item, index) in singerList" :key="index" @tap="goSinger(item)">
				<view class="choise-item"  >
					<image :src="filePath + item.pic" mode="" ></image>
					<view class="choise-title">
						{{item.singer}}
					</view>
				</view>
			</view>
			
		</view>
		
		<!-- more choise -->
		<!-- style list -->
		
		<!-- screen recommend -->
		
		<!-- last -->
		<view class="last">
			没有啦&nbsp;~
		</view>
	</view>
</template>

<script>
	import appRequest from "@/common/appRequestUrl.js"
	export default {
		name: "Find",
		props:{},
		data() {
			return {
				filePath:appRequest.urlMap.getFile,
				swpierList:[
					
				],songList:[],
				singerList:[],
			}
		},
		created:function(){
			this.getCarouse();
			this.getSongList();
			this.getSingerList();
		},
		methods:{
			goSinger(item){
				uni.navigateTo({
					url:"/pages/common/musicList?id="+item.id
				})
			},
			goPlay(item){
				uni.navigateTo({
					url: '../../pages/play/play?id='+item.id
				})
			},getCarouse(){
				let _this = this;
				appRequest.request({
				  data: {
				    validFlag: 1
				  },
				  url: appRequest.urlMap.findSysCarouselList,
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.swpierList = res.data.data;
				    } else {
				      _this.$api.msg(res.data.msg);
				    }
				  },
				  fail: function(res) {
				   _this.$api.msg("网络异常");
				  }
				});
			},getSongList(){
				let _this = this;
				appRequest.request({
				  data: {
				    validFlag: 1,
					type:0
				  },
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
			},getSingerList(){
				let _this = this;
				appRequest.request({
				  data: {
				    validFlag: 1
				  },
				  url: appRequest.urlMap.findNmSingerList,
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
			}
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
