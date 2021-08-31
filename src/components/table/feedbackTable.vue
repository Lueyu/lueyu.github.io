<template>
    <el-table
        stripe
        style="width: 100%"
        :data="tableData"
        :header-cell-style="tableHeaderColor"
        ref="multipleTable"
    >
        <el-table-column prop="id" label="id" width="50px"> </el-table-column>
        <el-table-column prop="create time" label="create time" width="150px">
        </el-table-column>
        <el-table-column prop="star" label="star" width="100px">
        </el-table-column>
        <el-table-column prop="comment" label="comment">
        </el-table-column>
        <el-table-column prop="email" label="email" width="300px">
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'feedbackTable',
    props: ['tableData'],
    data() {
        return {}
    },
    methods: {
        //  modify the table header the background color
        tableHeaderColor({ rowIndex }) {
            if (rowIndex === 0) {
                return 'background-color: lightblue; color: #fff; font-weight: 500;'
            }
        }
    }
}
</script>
