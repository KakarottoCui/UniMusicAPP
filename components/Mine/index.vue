<template name="Mine">
	<view class="mine" v-if="userInfo">
		<!-- user info -->
		<view class="mine-user">
			<view class="user-info">
				<view style="margin-left: 30rpx;">
					<image class="card-image" :src="filePath + userInfo.pic" mode="" ></image>
				</view>
				
				<view class="user-msg">
					{{userInfo.nickName}}
				</view>
			</view>
			<view class="user-login" @click="logout">
				退出登录
			</view>
		</view>
		<!-- user category -->
		
		<!-- my new -->
		<view class="user-new-title">
			<view class="new-title">
				我的音乐
			</view>
			<text class="new-title-icon text-black cuIcon-right"></text>
		</view>
		<view class="mine-new-card" style="justify-content: flex-start;">
			<view class="new-card" @click="toMcollect" >
				<text class="new-card-icon text-red cuIcon-likefill"></text>
				<view class="new-msg">
					我收藏的歌
				</view>
			</view>
			<view class="new-card" style="margin-left: 30rpx;" @click="toScollect">
				<text class="new-card-icon text-white cuIcon-service"></text>
				<view class="new-msg" >
					我关注的歌手
				</view>
				<view class="new-bott">
					优秀歌手集合
				</view>
			</view>
			<!-- <view class="new-card">
				<text class="new-card-icon text-black cuIcon-wefill"></text>
				<view class="new-msg">
					最嗨电音
				</view>
				<view class="new-bott">
					专业电音平台
				</view>
			</view> -->
		</view>
		<!-- 最近播放 -->
		<!-- <view class="user-new-title">
			<view class="new-title">
				最近播放
			</view>
			<text class="new-title-icon text-black cuIcon-right"></text>
		</view>
		<view class="res-play">
			<image src="http://p2.music.126.net/JRNj03dPHidbM4jQ-HFK0A==/18826937604631903.jpg?param=200y200" mode=""></image>
			<view class="res-title">
				<view class="res-name">
					全部已播歌曲
				</view>
				<view class="res-num">
					3首
				</view>
			</view>
		</view> -->
		<!-- 创建歌单 -->
		<!-- <view class="user-new-title">
			<view class="new-title">
				创建歌单 0
			</view>
			<view class="new-coll">
				收藏歌单 0
			</view>
			<text class="new-title-icon text-black cuIcon-moreandroid"></text>
		</view>
		<view class="mine-create">
			<view class="create">
				+ &nbsp;&nbsp;&nbsp;导入外部歌单
			</view>
		</view>
		
		<view class="user-new-title">
			<view class="new-title">
				推荐歌单
			</view>
			<text class="new-title-icon text-black cuIcon-close"></text>
		</view>
		
		<view class="mine-recommend">
			<view class="recommend" v-for="(item, index) in recommList" :key="index" @tap="goPlay">
				<image :src="item.img" mode=""></image>
				<view class="recommend-title">
					<view class="title-name">
						{{item.name}}
					</view>
					<view class="title-msg">
						{{item.msg}}
					</view>
				</view>
			</view>
		</view> -->
		<!-- last -->
		<view class="last">
			到底啦&nbsp;~
		</view>
	</view>
</template>

<script>
	import appRequest from "@/common/appRequestUrl.js"
	export default {
		name: "Mine",
		props:{},
		data() {
			return {
				filePath: appRequest.urlMap.getFile,
				userInfo:false,
				cateList:[{	
						'id': 0,
						'title': '本地音乐',
						'icon': 'musicfill'
					}
				],
				recommList:[{
						'id': 0,
						'name': '找一个让你笑的人在一起',
						'img': 'http://p1.music.126.net/JpGpHfy_DUAWeuIQHrjYbg==/1418370012865049.jpg?param=40x40',
						'msg': '蕊希电台'
					}
				]
			}
		},created:function(){
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
		methods: {
			toMcollect(){
				uni.navigateTo({
					url:"/pages/common/musicCollect"
				})
			},toScollect(){
				uni.navigateTo({
					url:"/pages/common/singerCollect"
				})
			},
			logout(){
				uni.clearStorage()
				this.userInfo=false;
				uni.redirectTo({
					url:"/pages/common/login"
				})
			},
			goPlay(){
				uni.navigateTo({
					url: '../../pages/play/play'
				})
			}
		}
	}
</script>

<style>
	@import url("./index.css");
	.card-image{
		width: 120upx;
		height: 120upx;
		border-radius: 10px;
		margin-top: 25upx;
	}
</style>
