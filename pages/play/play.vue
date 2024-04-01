<template>
	<view class="content">
		<view class="status-bar"></view>
		<!-- header -->
		<view class="player-header" style="padding-top: 20upx;">
			<text class="player-header-icon text-white cuIcon-back" @tap="goBack"></text>
			<view>
				<image style="margin-left: 30rpx; width: 70rpx;height: 70rpx;" :src="filePath +songData.pic"></image>
			</view>
			<view class="player-header-title">
				<view class="title-name">
					{{songData.name}}
				</view>
				<view class="title-msg">
					{{songData.nmSinger.singer}}
				</view>
			</view>
			<!-- <text class="player-header-share text-white cuIcon-share"></text> -->
		</view>
		<view style="margin: 40rpx 40rpx 0 40rpx;color: white;">{{songData.introduction}}</view>
		<!-- videodisc -->
		<view class="player-videodisc">
			<image src="../../static/images/videodisc.png" mode=""></image>
		</view>
		<!-- optBar -->
		<view class="play-opt-bar" style="text-align: right;">
			<view class="" v-for="(item, index) in optList" :key="index">
				<text @click="collect()" class="text-white" :class="item.icon"></text>
				<text style="color: white;margin-left: 20rpx;font-size: 30rpx;">{{collectList.length}}</text>
			</view>

		</view>
		
		<!-- <audio style="text-align: left" :src="current.src" :poster="current.poster" :name="current.name" :author="current.author" :action="audioAction" controls></audio>
		 -->
		<!-- slider -->
		<view class="player-slider">
			<view class="player-currentTime">
				{{chCurrentTime[0]}}:{{chCurrentTime[1]}}
			</view>
			<slider 
			class="slider"
			min="0"
			:max="duration"
			:value="currentTime"
			activeColor="#b6b6b6"
			backgroundColor="#dedede"
			block-size="12"
			@change="changeProgress"
			/>
			<view class="player-duration">
				{{chDuration[0]}}:{{chDuration[1]}}
			</view>
		</view>
		<!-- playbar -->
		<view class="play-bar">
			<!-- <view class="">
				<text class="text-white cuIcon-repeal"></text>
			</view> -->
			<view class="">
				<text @tap="$api.msg('没有上一曲')" class="text-white cuIcon-backwardfill"></text>
			</view>
			<view class="play-menu">
				<text class="text-white cuIcon-playfill" :class="ifPlay?'cuIcon-stop':'cuIcon-playfill'" @tap="playMusic"></text>
			</view>
			<view class="">
				<text @tap="$api.msg('没有下一曲')" class="text-white cuIcon-play_forward_fill"></text>
			</view>
			<!-- <view class="">
				<text class="text-white cuIcon-list"></text>
			</view> -->
			
		</view>
	</view>
</template>

<script>
	import appRequest from "@/common/appRequestUrl.js"
	export default {
		data() {
			return {
				a:"",
				songData:{name:"加载中",nmSinger:{singer:"加载中"},pic:"",path:""},
				optList:[{
						'id': 0,
						'icon': 'cuIcon-like'
					}
				],
				duration: '100',
				currentTime: '0',
				chDuration: ['0', '00'],
				chCurrentTime: ['0', '00'],
				ifPlay: false,
				songId:0,
				filePath:appRequest.urlMap.getFile,
				audioContext:{},
				collectList:[]
			}
		},onLoad(options) {
			this.songId = options.id;
			this.getSongData();
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
		methods: {
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
					musicFk:this.songId,
					type:1,
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
				    musicFk:this.songId,
					type:1,
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
			play(){
				let _this = this;
				this.audioContext = uni.createInnerAudioContext();
				this.audioContext.autoplay = false;
				this.audioContext.src = this.filePath + this.songData.path;
				this.audioContext.loop = true;
				this.audioContext.onTimeUpdate(function(e){
					_this.updateTime();
				})
				this.playMusic();
				//<audio style="text-align: left" :src="filePath + songData.path" :poster="filePath + songData.pic" :name="songData.name" :author="songData.nmSinger.singer" :action="audioAction" controls></audio>
				
			},
			getSongData(){
				let _this = this;
				appRequest.request({
				  data: {
				    id:this.songId
				  },
				  url: appRequest.urlMap.findNmMusicLibraryList,
				  success: function(res) {
				    if (res.data.code == 200) {
				      _this.songData = res.data.data[0];
					  _this.play();
				    } else {
				      _this.$api.msg(res.data.msg);
				    }
				  },
				  fail: function(res) {
				   _this.$api.msg("网络异常");
				  }
				});
			},
			goBack(){
				this.audioContext.stop();
				uni.navigateBack()
			},
			playMusic(){
				var duration = this.audioContext.duration;
				var currentTime = this.audioContext.currentTime;
				this.duration = duration;
				this.currentTime = currentTime;
				this.chDuration[0] = Math.floor(Math.floor(duration)/60);
				this.chDuration[1] = Math.floor(duration)%60;
				this.chCurrentTime[0] = Math.floor(Math.floor(currentTime)/60);
				this.chCurrentTime[1] = Math.floor(currentTime)%60;
				if (this.ifPlay) {
					this.ifPlay = false;
					this.audioContext.pause();
				} else {
					this.ifPlay = true;
					this.audioContext.play();
				}
			},
			updateTime(){
				var duration = this.audioContext.duration;
				var currentTime = this.audioContext.currentTime;
				this.duration = duration;
				this.currentTime = currentTime;
				this.chDuration[0] = Math.floor(Math.floor(duration)/60);
				this.chDuration[1] = Math.floor(duration)%60;
				this.chCurrentTime[0] = Math.floor(Math.floor(currentTime)/60);
				this.chCurrentTime[1] = Math.floor(currentTime)%60;
			},
			changeProgress(e){
				
				this.audioContext.seek(e.detail.value);
				this.ifPlay = false;
				this.playMusic();
			},
			
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
