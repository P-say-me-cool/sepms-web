<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" style="position: relative">
      <!--      <h3 class="title">MES后台管理系统</h3>-->
      <!--      <h3 class="title"></h3>-->
      <img style="position: absolute;margin-top: 3px;margin-left:45px;width: 240px;"
           src="../assets/images/users_login.png"/>
      <el-form-item prop="username" style="margin-top: 60px;position: relative;margin-top: 48px;">
        <img style="position: absolute;margin-top: 11px;margin-left: 6px;width: 19px;height: 20px"
             src="../assets/images/user.png"/>
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号"
                  style="line-height: 43px">
          <!--          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>-->
        </el-input>
      </el-form-item>
      <el-form-item prop="password" style="position: relative;margin-top: 24px;">
        <img style="position: absolute;margin-top: 11px;margin-left: 6px;width: 19px;height: 20px"
             src="../assets/images/password.png"/>
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          style="line-height: 43px;"
          @keyup.enter.native="handleLogin"
        >
          <!--          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>-->

        </el-input>
      </el-form-item>
      <!--      <el-form-item prop="code">
              <el-input
                v-model="loginForm.code"
                auto-complete="off"
                placeholder="验证码"
                style="width: 63%"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" class="login-code-img"/>
              </div>
            </el-form-item>-->
      <el-row :gutter="20">
        <!--        <el-col :span="8">-->
        <!--          <el-checkbox v-model="loginForm.rememberMe" class="login_checkbok"-->
        <!--                       style="color: #08D1FA;font-family: PingFang SC;">-->
        <!--            记住密码-->
        <!--          </el-checkbox>-->
        <!--        </el-col>-->
        <el-col :span="24">
          <el-radio-group class="login_checkbok" v-model="radio">
            <el-radio :label="1" style="color: #08D1FA;font-family: PingFang SC;">普通用户</el-radio>
            <el-radio :label="2" style="color: #08D1FA;font-family: PingFang SC;">管理员用户</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <el-form-item style="width:100%;margin-top: 32px;">
        <!--        type="primary"-->
        <el-button
          :loading="loading"
          size="medium"
          style="font-family: 'PingFangSC-Regular';color:#FFFFFF;background:#01B4FE;border-radius: 4px; "
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span style="font-size: 14px;background-image:-webkit-linear-gradient(bottom,#33f0ff,#33f0ff,#8cf6ff );
                                                                       -webkit-background-clip:text;
                                                                       -webkit-text-fill-color:transparent;">Copyright © 2021<a
        data-v-860cad92="" href="http://www.risun.com"
        target="_blank"
        style=" font-size: 16px;font-weight: bold">旭阳数字科技有限公司</a> 出品</span>
    </div>
  </div>
</template>

<script>
  import { getCodeImg, getToken } from '@/api/login'
  import Cookies from 'js-cookie'
  import { encrypt, decrypt } from '@/utils/jsencrypt'
  import { encryptByDES } from '@/api/secret'

  export default {
    name: 'Login',
    data() {
      return {
        codeUrl: '',
        token:'',
        cookiePassword: '',
        loginForm: {
          username: '',
          password: '',
          rememberMe: false,
          code: '',
          uuid: ''
        },
        loginRules: {
          username: [
            { required: true, trigger: 'blur', message: '用户名不能为空' }
          ],
          password: [
            { required: true, trigger: 'blur', message: '密码不能为空' }
          ],
          code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
        },
        loading: false,
        redirect: undefined,
        radio: 1
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
      // this.getCode()
      this.getCookie()
    },
    methods: {
      getCode() {
        getCodeImg().then(res => {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        })
      },
      getCookie() {
        const username = Cookies.get('username')
        const password = Cookies.get('password')
        const rememberMe = Cookies.get('rememberMe')
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password === undefined ? this.loginForm.password : password,
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        }
      },
      handleLogin() {
        if (this.radio == '2') {
          const username = this.loginForm.username
          const password = encryptByDES(this.loginForm.password)
          getToken({"userName":username,"password":password}).then(res=>{
            let url = process.env.UNITY_URL + res
            window.open(url, '_blank')
          })
        }
        if (this.radio == '1') {
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              this.loading = true
              if (this.loginForm.rememberMe) {
                Cookies.set('username', this.loginForm.username, { expires: 30 })
                Cookies.set('password', this.loginForm.password, { expires: 30 })
                Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
              } else {
                Cookies.remove('username')
                Cookies.remove('password')
                Cookies.remove('rememberMe')
              }
              this.$store.dispatch('Login', this.loginForm).then(() => {
                this.$router.push({ path: this.redirect || '/' }).catch(() => {
                })
              }).catch(() => {
                this.loading = false
                // this.getCode()
              })
            }
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    /*background-image: url("../assets/images/login_home.png");*/
    background-image: url("../assets/images/login_home_number.png");
    /*background-size: cover;*/
    background-size: 100% 100%;
  }

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    /*color: #707070;*/
    color: #ffffff;
  }

  .login_checkbok {
    .el-checkbox__inner, .el-radio__inner {
      width: 20px;
      height: 20px;
      border: 2px solid #08D1FA;
      border-radius: 2px;
      background: rgba(63, 90, 179, 0.3);
      font-size: 14px;
      font-weight: 400;
      color: #08D1FA;
    }

    .el-radio__inner {
      border-radius: 10px;
    }
  }

  .login-form {
    border-radius: 6px;
    box-sizing: border-box;
    background: url("../assets/images/login_opacity.png") no-repeat;
    background-size: 100% 100%;
    /*background-size: cover;*/
    opacity: 0.9;
    width: 422px;
    padding: 44px 44px 24px 44px;
    margin-right: -50%;
    margin-top: 6%;

    .el-input {
      width: 334px;
      height: 43px;
      font-family: "PingFangSC-Regular";

      input {
        height: 38px;
        background-color: rgba(39, 176, 255, 0.2);
        border: 1px solid rgba(108, 205, 255, 0.5);
        border-radius: 2px;
        color: #FFFFFF;
        padding-left: 30px;
      }

    }

    .el-button {
      width: 334px;
      height: 42px;
      background: #01B4FE;
      border-radius: 4px;
      border: 1px solid rgba(108, 205, 255, 0.5);
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }

  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .login-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }

  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .login-code-img {
    height: 38px;
  }

</style>
