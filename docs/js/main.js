const d=document.querySelector(".searchList"),n=document.querySelector(".favsList");let g=document.querySelector(".searchInput");document.querySelector(".resetBtn");const p=document.querySelector(".searchBtn");document.querySelector(".delButn");let r=JSON.parse(localStorage.getItem("favourites")),i,m,f,l=[];r!==null&&(n.classList.remove("hidden"),n.innerHTML=" ",c(r,n,"Animes Favoritos","favsItems"));function y(a){a.preventDefault(),f=g.value.toLowerCase();const s=`https://api.jikan.moe/v4/anime?q=${f}"`;fetch(s).then(e=>{if(!e.ok)throw new Error("Network response was not ok");return e.json()}).then(e=>{i=e.data,console.log(i),d.innerHTML="",c(i,d,"Resultado de búsqueda","selected","hidden"),r!==null?(l=r,n.innerHTML=" ",c(l,n,"Animes Favoritos","favsItems")):(console.log("no hay favoritos"),n.innerHTML=""),v()})}p.addEventListener("click",y);function c(a,s,e,h,u){console.log("recarga");let o=`<h2>${e}</h2>`;a.forEach(t=>{m=t.images.jpg.image_url,t.myFavourite==!0||r&&r.some(L=>L.mal_id===t.mal_id)?o+=`<div class = "completeAnime ${h}" > `:o+='<div class = "completeAnime" > ',m!==null?o+=`
           
            <img src="${m}" alt="${t.title}" id = "${t.mal_id}">
            <h3 id = "${t.mal_id}">${t.title}</h3>
            <button  class = "delButn ${u}" >Borrar</button>`:o+=`
            <h3>${t.title}</h3>
            <img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="${t.title}">
            <button class = "delButn hidden" >Delete</button>`,o+="</div>"}),s.innerHTML+=o}function S(a){const s=a.target.id;console.log(s);const e=i.findIndex(u=>u.mal_id==s);if(!l.some(u=>u.mal_id==s))i[e].myFavourite=!0,l.push(i[e]);else return;d.innerHTML=" ",c(i,d,"Resultado de búsqueda","selected","hidden"),v()}d.addEventListener("click",S);function v(){n.classList.remove("hidden"),n.innerHTML=" ",c(l,n,"Animes Favoritos","favsItems"),localStorage.setItem("favourites",JSON.stringify(l))}
//# sourceMappingURL=main.js.map
