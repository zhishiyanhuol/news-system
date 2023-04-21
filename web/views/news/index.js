
//引入模块

import { load } from "/web/util/LoadView.js"


load("topbar-news") //加载topbar 

let list = []
search.oninput =async function(){
    // console.log(search.value)
    if(!search.value ) {
        document.querySelector(".list-group").style.display = "none"
        return
    } 
    document.querySelector(".list-group").style.display = "block"
     let res =await fetch("http://localhost:3000/news?title_like="+search.value).then(res=>res.json())
    // console.log(res)
    document.querySelector(".list-group").innerHTML = res.map(item=>`
    <li class="list-group-item"><a href="/web/views/detail/index.html?id=${item.id}">${item.title}</a></li>
    `).join("")
}
search.onblur = function(){
    setTimeout(()=>{
        document.querySelector(".list-group").style.display = "none"
    },300)
}


async function render(){
    await renderList()
    await renderTab()
}

async function renderList(){
   list =  await fetch("http://localhost:3000/news").then(res=>res.json())
   list.reverse()
//    console.log(list.slice(0,4))
   let cardcontainer = document.querySelector(".cardContainer")
   cardcontainer.innerHTML = list.slice(0,4).map(item=>`
   
   <div class="card" data-id="${item.id}">
        <div style="background-image:url(${item.cover});" class="imgcover"></div>
        <div class="card-body">
            <h5 class="card-title" style="font-size:16px">${item.title}</h5>
            <p class="card-text" style="font-size:12px;color:gray;">作者:${item.author}</p>
        </div>
    </div>
   `).join("")

   let cardcontainers = document.querySelector(".myself")
   cardcontainers.innerHTML = list.slice(0,20).map(item=>`
   
   <div class="card" data-id="${item.id}">
        <div class="card-body">
            <h5>${item.title}</h5>
        </div>
    </>
   `).join("")

   for(let item of document.querySelectorAll(".card")){
    // console.log(item.dataset.id)
    item.onclick = function(){
        location.href=`/web/views/detail/index.html?id=${item.dataset.id}`
    }
   }
}

let cardcontainered = document.querySelector(".myhef")
   cardcontainered.innerHTML = `往期精彩`

function renderTab(){
    let categoryObj = _.groupBy(list,item=>item.category)
    console.log(categoryObj)

    let tabs = [tab0,tab1,tab2]

    tabs.forEach((item,index)=>{
        item.innerHTML = categoryObj[index]?.map(item=>
            `<div class="listitem" data-id="${item.id}">
                <img src="${item.cover}" data-id="${item.id}"/>
                <div data-id="${item.id}">${item.title}</div>
                <p class="card-text" style="font-size:12px;color:gray;" data-id="${item.id}">作者:${item.author}</p>
            </div>`
        ).join("") || ""

        item.onclick = function(evt){
            // console.log("111",evt.target.dataset.id)
            location.href=`/web/views/detail/index.html?id=${evt.target.dataset.id}`
        }
    })  
}

render()

