<template>
    <el-header class="before-login-page">
        <!-- <div class="login" v-if="login_visibility">
                <el-card>
                    <h2>Developer Login</h2>
                    <el-form
                        class="login-form"
                        :model="model"
                        :rules="rules"
                        ref="form"
                        @submit.native.prevent="login"
                    >
                        <el-form-item prop="username">
                            <el-input
                                v-model="model.username"
                                placeholder="Username"
                                prefix-icon="el-icon-user-solid"
                            ></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                v-model="model.password"
                                placeholder="Password"
                                type="password"
                                prefix-icon="el-icon-lock"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                :loading="loading"
                                class="login-button"
                                type="primary"
                                native-type="submit"
                                block
                                >Login</el-button
                            >
                        </el-form-item>
                        <a
                            class="login-linking"
                            href="https://oxfordinformatics.com/"
                            >Forgot password ?</a
                        >
                        <br /><br />
                        <a
                            class="login-linking"
                            href="https://chatbotexcellence.bosch.com.cn/"
                            >Back to Landing Page</a
                        >
                    </el-form>
                </el-card>
            </div> -->
        <div class="page" v-if="login_visibility">
            <el-row>
                <el-col :span="24"
                    ><div class="grid-content bg-purple-dark">
                        <!-- bosch logo bar -->
                        <img
                            class="bosch-logo-bar"
                            referrerpolicy="no-referrer"
                            src="../../assets/login_images/bosch-logo-bar.png"
                        />
                        <!-- bosch logo -->
                        <img
                            class="bosch-logo"
                            referrerpolicy="no-referrer"
                            src="../../assets/login_images/bosch-logo.png"
                        /></div
                ></el-col>
            </el-row>

            <div class="main-content">
                <el-row>
                    <el-col :span="12"
                        ><div class="grid-content bg-purple">
                            <div class="login-body">
                                <div class="message">
                                    <span class="welcome">Welcome</span>
                                    <span class="word"
                                        >Please&nbsp;login&nbsp;your&nbsp;account</span
                                    >
                                </div>
                                <el-form
                                    class="login-form"
                                    :model="model"
                                    :rules="rules"
                                    ref="form"
                                    @submit.native.prevent="login"
                                >
                                    <el-form-item prop="username">
                                        <el-input
                                            v-model="model.username"
                                            placeholder="Username"
                                            prefix-icon="el-icon-user-solid"
                                            class="login-username login-input"
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input
                                            v-model="model.password"
                                            placeholder="Password"
                                            type="password"
                                            prefix-icon="el-icon-lock"
                                            show-password
                                            class="login-password login-input"
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button
                                            :loading="loading"
                                            class="login-button"
                                            type="primary"
                                            native-type="submit"
                                            block
                                            >Login</el-button
                                        >
                                    </el-form-item>
                                    <a
                                        class="login-linking"
                                        href="https://chatbotexcellence.bosch.com.cn/"
                                        >Back to Landing Page</a
                                    >
                                </el-form>
                            </div>
                        </div></el-col
                    >
                    <el-col :span="12"
                        ><div class="grid-content bg-purple-light">
                            <img
                                class="chatbot-pic"
                                src="../../assets/login_images/chatbot.png"
                            /></div
                    ></el-col>
                </el-row>
            </div>
        </div>
    </el-header>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            login_visibility: true,
            // used for login page
            validCredentials: {
                username: '',
                password: ''
            },
            model: {
                username: '',
                password: ''
            },
            loading: false,
            rules: {
                username: [
                    {
                        //required: true,
                        message: 'Username is required',
                        trigger: 'blur'
                    }
                    //   {
                    //     min: 4,
                    //     message: "Username length should be at least 5 characters",
                    //     trigger: "blur"
                    //   }
                ],
                password: [
                    {
                        //required: true,
                        message: 'Password is required',
                        trigger: 'blur'
                    }
                    //   {
                    //     min: 5,
                    //     message: "Password length should be at least 5 characters",
                    //     trigger: "blur"
                    //   }
                ]
            }
        }
    },
    methods: {
        simulateLogin() {
            return new Promise(resolve => {
                setTimeout(resolve, 800)
            })
        },
        async login() {
            let valid = await this.$refs.form.validate()
            if (!valid) {
                return
            }
            this.loading = true
            await this.simulateLogin()
            this.loading = false
            if (
                this.model.username === this.validCredentials.username &&
                this.model.password === this.validCredentials.password
            ) {
                this.$message.success('Login successful')
                this.login_visibility = false
                this.$emit('loginEvent', false)
            } else {
                this.$message.error('Username or password is invalid')
            }
        }
    }
}
</script>

<style src="../../style/login.css" />
