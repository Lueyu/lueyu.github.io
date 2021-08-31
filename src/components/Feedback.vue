<template>
    <el-container>
        <!-- after login -->
        <div class="after-login">
            <el-header v-if="!login_visibility" :style="table_container">
                <div class="header">
                    <h2 class="logo">
                        <div class="div_logo">
                            <img
                                src="@/assets/logo.png"
                                alt="Logo"
                                class="logo"
                            />
                        </div>
                    </h2>
                </div>
                <el-tabs v-model="activeName" @tab-click="getlivestockInfo">
                    <el-row :gutter="20">
                        <!-- Date search -->
                        <el-col :span="8">
                            <div class="grid-content bg-purple">
                                <div class="block">
                                    <el-date-picker
                                        v-model="value2"
                                        type="datetimerange"
                                        :picker-options="pickerOptions"
                                        range-separator="To"
                                        start-placeholder="Start date"
                                        end-placeholder="End date"
                                        align="right"
                                    >
                                    </el-date-picker>
                                </div>
                            </div>
                        </el-col>

                        <!-- query string input -->
                        <el-col :span="2.5">
                            <div class="grid-content bg-purple">
                                <el-input
                                    placeholder="Search by keywords"
                                    prefix-icon="el-icon-search"
                                    v-model="keywords"
                                    ref="key"
                                >
                                </el-input>
                            </div>
                        </el-col>

                        <!-- tag selection -->
                        <el-col :span="3"
                            ><div class="grid-content bg-purple">
                                <el-select
                                    v-model="value"
                                    clearable
                                    placeholder="Select"
                                >
                                    <el-option
                                        v-for="item in searchOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </el-col>
                        
                        <el-col :span="5">
                            <div class="grid-content bg-purple">
                                <el-button-group>
                                    <el-button
                                        type="primary"
                                        icon="el-icon-search"
                                        @click="filterData"
                                    ></el-button>
                                    <el-button
                                        type="success"
                                        @click="resetData"
                                        icon="el-icon-refresh"
                                    ></el-button>
                                </el-button-group></div
                        ></el-col>
                        <download-excel :data="tableData" :name="tableName">
                            <el-button type="warning" icon="el-icon-download">
                            </el-button>
                        </download-excel>
                    </el-row>
                    <p></p>
                    <el-tab-pane label="Feedback" name="first">
                        <FeedbackTable :tableData="tableData"></FeedbackTable>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            layout="prev, next, jumper"
                        >
                        </el-pagination
                    ></el-tab-pane>
                    <!-- Requirement Table -->
                    <el-tab-pane label="Requirement" name="second">
                        <RequirementTable
                            :tableData="tableData"
                        ></RequirementTable>

                        <!-- Pagination -->
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            layout="prev, next, jumper"
                        >
                        </el-pagination
                    ></el-tab-pane>
                    <!-- Subscribe Table -->
                    <el-tab-pane label="Subscribe" name="third">
                        <SubscribeTable :tableData="tableData"></SubscribeTable>

                        <!-- Pagination -->
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            layout="prev, next, jumper"
                        >
                        </el-pagination
                    ></el-tab-pane>
                    <!-- Contact Table -->
                    <el-tab-pane label="Contact" name="fourth">
                        <ContactTable :tableData="tableData"></ContactTable>

                        <!-- Pagination -->
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            layout="prev, next, jumper"
                        >
                        </el-pagination
                    ></el-tab-pane>
                </el-tabs>
            </el-header>
        </div>
        <Login @loginEvent="loginUser"></Login>
    </el-container>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import VueSimpleAlert from 'vue-simple-alert'
import FeedbackTable from './table/feedbackTable'
import RequirementTable from './table/requirementTable'
import SubscribeTable from './table/subscribeTable'
import ContactTable from './table/contactTable'
import Login from './login/Login'
import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)

Vue.use(VueSimpleAlert)
axios.defaults.baseURL = process.env.BASE_URL_API
export default {
    name: 'Feedback',
    data() {
        return {
            tableData: [],
            activeName: 'first',
            login_visibility: true,
            username: '',
            password: '',
            currentPage: 1, // current page number
            pageSize: 10, // Number of data per page
            keywords: '',
            searchOptions: [],
            options: [
                {
                    value: 1,
                    label: 'id (integer)'
                },
                {
                    value: 2,
                    label: 'star (integer)'
                },
                {
                    value: 3,
                    label: 'comment'
                },
                {
                    value: 4,
                    label: 'email'
                }
            ],
            value: '',

            // used for date picker
            pickerOptions: {
                shortcuts: [
                    {
                        text: 'Last week',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            )
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: 'Last month',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            )
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: 'Last 3 months',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            )
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            },
            value1: [
                new Date(2000, 10, 10, 10, 10),
                new Date(2000, 10, 11, 10, 10)
            ],
            value2: '',
            multipleSelection: []
        }
    },
    components: {
        FeedbackTable,
        RequirementTable,
        SubscribeTable,
        ContactTable,
        Login
    },
    computed: {
        hasDate: function () {
            return !(this.value2 == null || this.value2 === '')
        },
        hasQuery: function () {
            return !(this.keywords === '')
        },
        tableName: function () {
            if (this.activeName === 'first') {
                return 'feedback'
            } else {
                return 'requirement'
            }
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.currentPage = val
            this.getlivestockInfo()
        },
        loginUser(val) {
            this.login_visibility = val
            this.getlivestockInfo()
        },
        getlivestockInfo() {
            let command = 'regular'
            // if (this.hasDate || this.hasQuery) {
            //     command = 'filter-pagination'
            // }
            axios
                .post('/', {
                    current_page: this.currentPage,
                    page_size: this.pageSize,
                    command: command,
                    active_name: this.activeName
                })
                .then(response => {
                    console.log('Regular request succeeded')
                    console.log(response)
                    this.tableData = response.data
                })
                .catch(error => {
                    console.log('Request failed')
                    console.log(error)
                })
        },
        toggleSelection(rows) {
            console.log(rows)
            console.log(this.multipleSelection[0].id)
            this.$confirm('Are you sure? This is irreversible.').then(() => {
                axios
                    .post('/', {
                        selection: this.multipleSelection,
                        command: 'delete'
                    })
                    .then(response => {
                        console.log('Delete request succeeded')
                        console.log(response)
                        this.tableData = response.data
                    })
                    .catch(error => {
                        console.log('Delete request failed')
                        console.log(error)
                    })
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        checkInputType(hasDate) {
            // check input type
            let intTag = [1, 2]
            let strTag = [3, 4]

            // check if the input string is a strict integer
            // cannot be '123r', simply using parseInt() will
            // not work
            function isInt(value) {
                var er = /^-?[0-9]+$/
                return er.test(value)
            }

            if (intTag.includes(this.value)) {
                if (!isInt(this.keywords) || this.keywords === '') {
                    this.$alert(
                        'Incorrect input type. Please enter an integer.'
                    )
                    return false
                }
                this.hasQuery = true
            } else if (strTag.includes(this.value)) {
                this.hasQuery = true
            } else if (!strTag.includes(this.value) && !hasDate) {
                this.$alert('Missing tag.')
                return false
            }

            return this.hasQuery
        },
        // checkInputRange() {
        //     if (this.value === 1) {
        //         // should be within max and min integer range
        //         if (
        //             parseInt(this.keywords) > 2147483647 ||
        //             parseInt(this.keywords) < -2147483647
        //         ) {
        //             this.$alert('Input out of range.')
        //             return false
        //         }
        //     } else if (this.value === 2) {
        //         if (
        //             parseInt(this.keywords) > 5 ||
        //             parseInt(this.keywords) < 0
        //         ) {
        //             this.$alert('Star value out of range.')
        //             return false
        //         }
        //     } else if (this.value === 3) {
        //         if (this.keywords.length > 50) {
        //             this.$alert('Input out of range. (>50 characters)')
        //         }
        //     } else if (this.value === 4) {
        //         if (this.keywords.length > 20) {
        //             this.$alert('Input out of range. (>20 characters)')
        //         }
        //     }
        //     return true
        // },
        filterData() {
            this.keywords = this.$refs.key.value.trim()
            console.log(this.keywords)
            console.log(this.value)

            // Convert Date() object into Unix time
            let startTime = -1
            let endTime = -1
            if (this.value2 === '') {
                console.log('invalid')
            } else {
                startTime = Math.round(this.value2[0].getTime() / 1000)
                endTime = Math.round(this.value2[1].getTime() / 1000)
                this.hasDate = true
            }

            this.hasQuery = this.checkInputType(this.hasDate)
            // let withinRange = this.checkInputRange()
            // if (!withinRange) return

            if (!this.hasQuery && !this.hasDate) return

            axios
                .post('/', {
                    key: this.keywords,
                    tag: this.value,
                    command: 'filter',
                    has_date: this.hasDate,
                    has_query: this.hasQuery,
                    start_time: startTime,
                    end_time: endTime,
                    active_name: this.activeName
                })
                .then(response => {
                    console.log('Filter data succeeded')
                    console.log(response)
                    this.tableData = response.data
                })
                .catch(error => {
                    console.log('Filter data failed')
                    console.log(error)
                })
        },
        resetData() {
            this.hasDate = false
            this.hasQuery = false
            axios
                .post('/', {
                    current_page: 1,
                    page_size: 10,
                    command: 'regular',
                    active_name: this.activeName
                })
                .then(response => {
                    console.log('Reset data succeeded')
                    console.log(response)
                    this.tableData = response.data
                })
                .catch(error => {
                    console.log('Reset data failed')
                    console.log(error)
                })
        },
        appendSearchOptions(numArr) {
            for (let num in numArr) {
                this.searchOptions.push(this.options[numArr[num]])
            }
        },
        setSearchOptions() {
            this.searchOptions = []
            if (this.activeName === 'first') {
                this.appendSearchOptions([0, 1, 2, 3])
            } else if (this.activeName === 'second') {
                this.appendSearchOptions([0, 2, 3])
            } else if (this.activeName === 'third') {
                this.appendSearchOptions([0, 3])
            } else if (this.activeName === 'fourth') {
                this.appendSearchOptions([0, 3])
            }
        },
        getlivestockInfo() {
            this.setSearchOptions()
            let command = 'regular'
            axios
                .post('/', {
                    current_page: this.currentPage,
                    page_size: this.pageSize,
                    command: command,
                    active_name: this.activeName
                })
                .then(response => {
                    console.log('Regular request succeeded')
                    console.log(response)
                    this.tableData = response.data
                })
                .catch(error => {
                    console.log('Request failed')
                    console.log(error)
                })
        }
    }
}
</script>
