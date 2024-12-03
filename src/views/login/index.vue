<template>
	<div class="login-container">
		<div class="login-logo">
			<img style="height: 40px; width: 100%;" src="@/assets/title.png" />
		</div>
		
		<el-card class="login-card" shadow="hover">
			<el-form ref="formRef" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
				label-position="left">
				<div class="title-container">
					<h3 class="title">通信基站机柜高效热管理平台</h3>
				</div>
				<el-form-item prop="username">
					<span class="svg-container">
						<svg-icon name="ele-UserFilled" />
					</span>
					<el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username"
						type="text" tabindex="1" auto-complete="on" />
				</el-form-item>
				<el-form-item prop="password">
					<span class="svg-container">
						<svg-icon name="ele-Lock" />
					</span>
					<el-input :key="passwordType" ref="passwordRef" v-model="loginForm.password" :type="passwordType"
						placeholder="Password" name="password" tabindex="2" auto-complete="on"
						@keyup.enter.native="handleLogin" />
					<span class="show-pwd" @click="showPwd">
						<svg-icon :name="passwordType === 'password' ? 'ele-Hide' : 'ele-View'" />
					</span>
				</el-form-item>
				<el-form-item prop="code">
					<span class="svg-container">
						<svg t="1733215516793" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2040" width="16" height="16"><path d="M512 85.333333L149.333333 207.232v365.738667C149.333333 774.912 311.722667 938.666667 512 938.666667s362.666667-163.754667 362.666667-365.696V207.232L512 85.333333z m294.656 487.637334c0 164.096-131.925333 297.130667-294.656 297.130666-162.730667 0-294.656-133.034667-294.656-297.130666V258.688L512 153.898667l294.656 104.789333v314.282667z m-420.864-96.128a33.749333 33.749333 0 0 0-48.042667 0 34.346667 34.346667 0 0 0 0 48.512l122.282667 123.178666 1.962667 1.962667a31.914667 31.914667 0 0 0 45.397333 0l211.157333-212.864a32.426667 32.426667 0 0 0 0-45.781333l-2.688-2.688a31.914667 31.914667 0 0 0-45.44 0l-185.813333 187.306666-98.773333-99.626666h-0.042667z" fill="#515151" p-id="2041"></path></svg>
					</span>
					<el-input placeholder="验证码" tabindex="2" auto-complete="on" style="width: 55%;"/>
					<img src="@/assets/code.png" style="width: 36%; position: absolute;right: 0px;" alt="">
				</el-form-item>
				<el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;height: 40px;"
					@click.native.prevent="handleLogin">登 陆</el-button>
			</el-form>
		</el-card>
		<div class="login-copyright">
			<div class="copyright">
				<a ref="https://beian.miit.gov.cn" style="display: inline;">豫ICP备19020917号 </a>
				<p style="display: inline;"> Copyright © 2022 - 2024 河南新网元通信技术有限公司</p>
			</div>
			
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'Login'
}
</script>

<script lang="ts" setup>
import { useUserInfoStore } from '@/stores/userInfo'
import type { FormInstance } from 'element-plus'
import { nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const userInfoStore = useUserInfoStore()
const route = useRoute()
const router = useRouter()
const loginForm = ref({
	username: 'admin',
	password: '111111'
})
const loading = ref(false)
const passwordType = ref('password')
const redirect = ref('')
const passwordRef = ref<HTMLInputElement>()
const formRef = ref<FormInstance>()

const validateUsername = (rule: any, value: any, callback: any) => {
	if (value.length < 4) {
		callback(new Error('用户名长度不能小于4位'))
	} else {
		callback()
	}
}
const validatePassword = (rule: any, value: any, callback: any) => {
	if (value.length < 6) {
		callback(new Error('密码长度不能小于6位'))
	} else {
		callback()
	}
}

const loginRules = {
	username: [{ required: true, validator: validateUsername }],
	password: [{ required: true, trigger: 'blur', validator: validatePassword }]
}

watch(
	route,
	() => {
		redirect.value = route.query && (route.query.redirect as string)
	},
	{ immediate: true }
)

/* 
切换密码的显示/隐藏
*/
const showPwd = () => {
	if (passwordType.value === 'password') {
		passwordType.value = 'text'
	} else {
		passwordType.value = 'password'
	}
	nextTick(() => {
		passwordRef.value?.focus()
	})
}

/* 
点击登陆的回调
*/
const handleLogin = async () => {
	await formRef.value?.validate()
	loading.value = true
	const { username, password } = loginForm.value
	try {
		await userInfoStore.login(username, password)
		router.push({ path: redirect.value || '/' })
	} finally {
		loading.value = false
	}
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #220808;
$cursor: #a9a5a5;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
	.login-container .el-input input {
		color: $cursor;
	}
}

/* reset element-ui css */
.login-container {
	background-image: url(../../assets/bg1.png);
	background-color: #2d3a4b;
	background-size: cover;
	background-position: center;
    background-repeat: no-repeat;

	.el-input {
		display: inline-block;
		height: 47px;
		width: 85%;

		.el-input__wrapper {
			width: 100%;
			background-color: transparent;
			box-shadow: none;

			input {
				background: transparent;
				border: 0px;
				-webkit-appearance: none;
				border-radius: 0px;
				padding: 12px 5px 12px 15px;
				color: $light_gray;
				height: 47px;
				caret-color: $cursor;

				&:-webkit-autofill {
					box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-text-fill-color: $cursor !important;
				}
			}
		}
	}

	.el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 20px;
		color: #454545;
	}
	.el-button{
		border-radius: 20px;
	}
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #191a1b;
$light_gray: #eee;

.login-container {
	backface-visibility: hidden;
	height: 100%;
	width: 100%;
	background-color: $bg;
	overflow: hidden;
	.login-logo{
		position: absolute;
		top: 33px;
		left: 50px;
		height: 40px;
		
	}
	.login-card{
		position: absolute;
		width: 520px;
		right: 10%;
		top:10%;
	}
	.login-form {
		max-width: 100%;
		padding: 10px 35px 0;
		margin: 0 auto;
		overflow: hidden;
	}

	.tips {
		font-size: 14px;
		color: #ece9e9;
		margin-bottom: 10px;

		span {
			&:first-of-type {
				margin-right: 16px;
			}
		}
	}

	.svg-container {
		padding: 6px 5px 6px 15px;
		color: $dark_gray;
		vertical-align: middle;
		width: 30px;
		display: inline-block;
	}

	.title-container {
		position: relative;
		.title {
			margin: 0 auto 0 auto;
			font-family:"PingFangSC-Regular";
			font-size: 22px;
			text-align: center;
			color: #151010;
			font-weight: 400;
			padding: 20px 0;
		}
	}

	.show-pwd {
		position: absolute;
		right: 10px;
		top: 10px;
		font-size: 16px;
		color: $dark_gray;
		cursor: pointer;
		user-select: none;
	}
	.login-copyright{
		display: inline-block;
		position: absolute;
		bottom: 4px;
		font-size: 14px;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		color: #7a7a7c;
		line-height: 17px;
		font-style: normal;
		left:50%;
		margin-left: -244px;
	}
}
</style>
