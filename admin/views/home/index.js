
//引入模块

import { load, isLogin } from "/admin/util/LoadView.js"

load("sidemenu-home") //加载topbar //sidemenu

let user = JSON.parse(isLogin())
let categoryList = ["新闻早知道", "风采中国", "财经娱乐"]

// console.log(user)

document.querySelector(".userprofile").innerHTML = `
    <img src="${user.photo}" style="width:100px;"/>
    <div>
        <div>${user.username}</div>
        <div><pre>${user.introduction || "这个人很懒"}</pre></div>
    </div>
`




async function analyst() {
    let res = await fetch("http://localhost:3000/news?author=" + user.username).then(res => res.json())
    console.log(res)
    let obj = _.groupBy(res, item => item.category)

    let arr = []
    for (let i in obj) {
        arr.push({
            name: categoryList[i],
            value: obj[i].length
        })
    }
    renderEcharts(arr)
}

function renderEcharts(data) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '当前用户发布的新闻',
            subtext: '不同类别占比',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '类别',
                type: 'pie',
                radius: '50%',
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

analyst()