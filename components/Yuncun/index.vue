<template name="Yuncun">
	<view class="yuncun">
		
		<!-- video-card -->
		<view class="yuncun-video-card">
			<view class="video-card" v-for="(item, index) in articleList" :key="index" @tap="goPlay(item)">
				<image class="video-card-image" :src="filePath + (item.pic||'nuoMi.png')" mode=""></image>
				<view class="video-card-comm" style="padding-left: 15rpx;">
					{{item.title}}
				</view>
				<view class="video-card-bottom">
					<view class="card-bottom-left">
						<image class="card-bottom-image" :src="filePath + (item.sysUser.pic||'nuoMi.png')" mode=""></image>
						<view class="card-bottom-name">
							{{item.sysUser.nickName}}
						</view>
					</view>
					<view class="card-bottom-right">
						<view class="card-bottom-num">
							{{item.collectList ? item.collectList.length : 0}}赞
						</view>
						<text class="card-bottom-icon text-gray cuIcon-moreandroid"></text>
					</view>
				</view>
			</view>
			
		</view>
		<!-- last -->
		<view class="last">
			没有啦&nbsp;~
		</view>
		
		<view style="position: fixed;bottom: 50rpx;right: 50rpx;">
			<view @click="addArticle()" style="border-radius: 50rpx; background-color:#ff0000; width: 100rpx;height: 100rpx;font-size: 90rpx;text-align: center;line-height: 90rpx;color: white;">
				+</view>
		</view>
		
	</view>
</template>

<script>
	import appRequest from "@/common/appRequestUrl.js"
	import ygyUploadImg from '@/components/ygy-upload-img/ygy-upload-img.vue'
	
	export default {
		name: "Yuncun",
		props:{},
		data() {
			return{
				filePath:appRequest.urlMap.getFile,
				articleList:[],
				videoList:[{
						'id': 0,
						'img': 'http://p2.music.126.net/VDN3UgDoNu_2t1Bm46t54A==/109951164777422663.jpg?param=140y140',
						'comm': '宇宙星河浪漫，生活温柔且可爱',
						'uimg': 'http://p2.music.126.net/VDN3UgDoNu_2t1Bm46t54A==/109951164777422663.jpg?param=140y140',
						'uname': '情思天鹅',
						'num': 18
					}
					
				]
			}
		},created:function(){
			this.getArticle();
		},
		methods:{
			addArticle(){
				uni.reLaunch({
					url:"/pages/common/addArticle"
				})
			},
			getArticle(){
				let _this = this;
				appRequest.request({
				  data: {
				    validFlag: 1
				  },
				  url: appRequest.urlMap.findNmArticleList,
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.articleList = res.data.data;
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
				uni.navigateTo({
					url:"/pages/common/aritclePage?id="+item.id
				})
			}
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
