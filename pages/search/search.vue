<template>
	<view class="content">
		<view class="status-bar"></view>
		<!-- serchBar -->
		<view class="search-box">
			<text class="search-box-icon text-black cuIcon-back" @tap="goBack"></text>
			<view class="search-input">
				<input v-model="key"
				class="input"
				type="text" 
				value=""
				focus="true"
				placeholder="输入关键字搜索"
				placeholder-style="color:#ababab;"
				@confirm="search"
				/>
			</view>
			<!-- <text class="search-box-icon text-black cuIcon-people"></text> -->
		</view>
		<!-- 热搜title -->
		<view class="hot-search-title">
			搜索结果
		</view>
		<!-- 热搜列表 -->
		<view class="hot-search-list" >
			
			<view style="color: crimson;" v-if="songList.length>0">歌曲MV</view>
			<view class="search-list" v-for="(item, index) in songList" :key="index"  @click="goPlay(item)">
				<view class="search-list-left">
					<view class="search-rank">
						{{index + 1}}
					</view>
					<view class="search-list-title">
						<view class="search-list-name">
							{{item.name}}
						</view>
						<!-- <view class="search-list-msg">
							{{item.msg}}
						</view> -->
					</view>
				</view>
			</view>
			
			<view style="color:darkgreen" v-if="singerList.length>0">歌手</view>
			<view class="search-list" v-for="(item, index) in singerList" :key="index"  @click="goSinger(item)">
				<view class="search-list-left">
					<view class="search-rank">
						{{index+1}}
					</view>
					<view class="search-list-title">
						<view class="search-list-name">
							{{item.singer}}
						</view>
						<!-- <view class="search-list-msg">
							{{item.msg}}
						</view> -->
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
		data() {
			return {
				key:"",
				singerList:[],
				songList:[],
				searchList:[]
			}
		},
		methods: {
			goPlay(item){
				uni.navigateTo({
					url: '/pages/play/play?id='+item.id
				})
			},
			goSinger(item){
				uni.navigateTo({
					url:"/pages/common/musicList?id="+item.id
				})
			},
			search(){
				this.getSinger();
				this.getMusic();
			},
			getSinger(){
				let _this = this;
				appRequest.request({
				  data: {
				    singer:this.key,
					validFlag:1
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
			},
			getMusic(){
				let _this = this;
				appRequest.request({
				  data: {
				    name:this.key,
					validFlag:1
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
			},
			goBack(){
				uni.redirectTo({
					url:"/pages/index/index"
				})
			},
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
