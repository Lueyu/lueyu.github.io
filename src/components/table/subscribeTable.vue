<template>
    <el-table
        stripe
        style="width: 100%"
        :data="tableData"
        :header-cell-style="tableHeaderColor"
    >
        <el-table-column prop="id" label="id" width="100px"> </el-table-column>
        <el-table-column prop="create time" label="create time" width="250px">
        </el-table-column>
        <el-table-column prop="email" label="email">
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'subscribeTable',
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
