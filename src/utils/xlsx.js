import XLSXStyle from 'xlsx-style'
import XLSX from 'xlsx'

export function exportExcel(json, sheetName, fileName) {
    let ws = XLSX.utils.json_to_sheet(json)
    let columnIndex = []
    let columnName = []
    if (json.length > 0) {
        for (let prop in json[0]) {
            columnName.push(prop)
        }
    }
    for (let i = 0; i < columnName.length; i++) {
        columnIndex.push(String.fromCharCode(65 + i) + '1')
    }
    let columnHeaderStyle = {
        font: {
            bold: true,
            color: {
                rgb: 'FFFFFF'
            }
        },
        fill: {
            bgColor: {
                indexed: 64
            },
            fgColor: {
                rgb: '70767D'
            }
        }
    }
    for (let j = 0; j < columnIndex.length; j++) {
        ws[columnIndex[j]]['s'] = columnHeaderStyle
    }

    ws['!cols'] = [
        { wch: 42 },
        { wch: 23 },
        { wch: 16 },
        { wch: 27 },
        { wch: 49 },
        { wch: 77 }
    ]
    let blob = sheet2blob(ws, sheetName)
    openDownloadXLSXDialog(blob, fileName)
}

//导出excel相关函数
function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1'
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    }
    workbook.Sheets[sheetName] = sheet
    // 生成excel的配置项
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    }
    var wbout = XLSXStyle.write(workbook, wopts)
    var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
    }
    return blob
}

function openDownloadXLSXDialog(url, saveName) {
    if (typeof url === 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url) // 创建blob地址
    }
    var aLink = document.createElement('a')
    aLink.href = url
    aLink.download = saveName || 'downloadTableData.xlsx' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event
    if (window.MouseEvent) event = new MouseEvent('click')
    else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent(
            'click',
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
        )
    }
    aLink.dispatchEvent(event)
}
