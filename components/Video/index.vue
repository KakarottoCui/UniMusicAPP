<template name="Video">
	<view class="video">
		<!-- nav -->
		<!-- <view class="video-nav">
			<view class="video-item selected">
				推荐
			</view>
			<view class="video-item">
				LOOK直播
			</view>
			<view class="video-item">
				#歌手#
			</view>
			<view class="video-item">
				现场
			</view>
			<view class="video-item">
				翻唱
			</view>
		</view> -->
		<!-- video-card -->
		<view class="video-card">
			<view class="card" v-for="(item, index) in videoList" :key="index" @click="goPlay(item)">
				<image class="card-image" :src="filePath + item.pic" mode="" @tap="goPlay(item)"></image>
				<view class="card-comm">
					{{item.name}}
				</view>
				<view class="card-bottom" @tap="goPlay(item)">
					<view class="card-bottom-left">
						<image class="card-bottom-image" :src="filePath+item.nmSinger.pic" mode=""></image>
						<view class="card-bottom-name">
							{{item.nmSinger.singer}}
						</view>
					</view>
					<view class="card-bottom-right">
						<text class="card-bottom-icon text-gray cuIcon-favor" style="color: gray;font-size: 30rpx;">{{item.collectList?item.collectList.length:0}}</text>
						<text class="card-bottom-icon text-gray cuIcon-message" style="color: gray;font-size: 30rpx;">{{item.commentList?item.commentList.length:0}}</text>
						<text class="card-bottom-icon text-gray cuIcon-moreandroid"></text>
					</view>
				</view>
			</view>
		</view>
		<!-- last -->
		<view class="last">
			没有啦&nbsp;~
		</view>
	</view>
</template>

<script>
	import appRequest from "@/common/appRequestUrl.js"
	export default {
		name: "Video",
		props: {},
		data() {
			return {
				filePath: appRequest.urlMap.getFile,

				videoList: []

			}
		},
		created: function() {

			this.getVideo();

		},
		methods: {
			goPlay(item) {
				uni.navigateTo({
					url: "/pages/common/videoPage?id=" + item.id
				})
			},
			getVideo() {
				let _this = this;
				appRequest.request({
					data: {
						validFlag: 1,
						type: 1
					},
					url: appRequest.urlMap.findNmMusicLibraryList,
					success: function(res) {
						if (res.data.code == 200) {
							_this.videoList = res.data.data;
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

<style>
	@import url("./index.css");
</style>