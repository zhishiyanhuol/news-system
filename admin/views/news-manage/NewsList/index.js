
//引入模块

import {load,isLogin} from "/admin/util/LoadView.js"

load("sidemenu-newsList") //加载topbar //sidemenu
let list = []

let updateId=  0

//预览模态框
let myPreviewModal = new bootstrap.Modal(document.getElementById('previewModal'))
let myDelModal = new bootstrap.Modal(document.getElementById('delModal'))

let categoryList = ["新闻早知道","风采中国","财经娱乐"]
async function render(){
    let username = JSON.parse(isLogin()).username
    list = await fetch(`http://localhost:3000/news?author=${username}`).then(res=>res.json())
    // console.log(list)
    listbody.innerHTML = list.map(item=>`
    <tr>
        <th scope="row">${item.title}</th>
        <td>
            ${categoryList[item.category]}
        </td>
        <td>
        <button type="button" class="btn btn-success btn-sm btn-preview" data-myid="${item.id}" >预览</button>
        <button type="button" class="btn btn-primary btn-sm btn-edit" data-myid="${item.id}" >编辑</button>
        <button type="button" class="btn btn-danger btn-sm btn-del" data-myid="${item.id}">删除</button>

        </td>
    </tr>

    `).join("")
}

listbody.onclick = function(evt){
    // console.log()
    if(evt.target.className.includes("btn-preview")){
        // console.log("预览",evt.target.dataset.myid)
        myPreviewModal.toggle()

        let obj = list.filter(item=>item.id==evt.target.dataset.myid)[0]
        // console.log(obj)
        renderPreviewModal(obj)
    }
    if(evt.target.className.includes("btn-edit")){
        console.log("编辑")
        location.href="/admin/views/news-manage/EditNews/index.html?id="+evt.target.dataset.myid //带上id
    }
    if(evt.target.className.includes("btn-del")){
        // console.log("删除",)
        updateId = evt.target.dataset.myid

        //显示删除modal
        myDelModal.toggle()
    }
}

function renderPreviewModal(obj){
    previewModalTitle.innerHTML  = obj.title
    previewModalContent.innerHTML  = obj.content
}


delConfirm.onclick = async function(){
    await fetch(`http://localhost:3000/news/${updateId}`,{
        method:"delete"
    })
    myDelModal.toggle()

    render()
}

render()