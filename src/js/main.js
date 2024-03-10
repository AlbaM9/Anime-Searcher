'use strict';


const masterContainer = document.querySelector(".masterContainer")
const seachResultsList = document.querySelector(".searchList")
const FavouritesList = document.querySelector(".favsList")
let searchInput = document.querySelector(".searchInput")
const resetBtn = document.querySelector(".resetBtn")
const searchBtn = document.querySelector(".searchBtn")


let savedAnimes = JSON.parse(localStorage.getItem("favourites"));


let animesToShow;
let imageCard;
let searchTerm;
let favArray = [];

if (savedAnimes !== null) {

    favArray = savedAnimes; //reasigno al inicio para funcionalidades. Si no no funciona la eliminacion
    favouritesRender();

}
function handleFilter(event) {
    event.preventDefault();

    searchTerm = searchInput.value.toLowerCase();
    const SERVER_URL = `https://api.jikan.moe/v4/anime?q=${searchTerm}"`;


    fetch(SERVER_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            animesToShow = data.data;
            seachResultsList.innerHTML = "";
            renderCards(animesToShow, seachResultsList, "Resultado de búsqueda", "selected", "hidden");


            if (savedAnimes !== null) {
                favArray = savedAnimes;
                masterContainer.classList.add("reverse");

            }

            favouritesRender();
        })

}
searchBtn.addEventListener("click", handleFilter);

function renderCards(animesData, list, title, styleClass, deBtn) {
    let content = `<h2>${title}</h2>`;

    animesData.forEach(card => {
        imageCard = card.images.jpg.image_url;

        if (savedAnimes && savedAnimes.some(savedAnime => savedAnime.mal_id === card.mal_id) || favArray && favArray.some(favAnime => favAnime.mal_id === card.mal_id)) { //mantiene seleecionadas las tarjetas que se encuentran en el favArray

            content += `<div class = "completeAnime ${styleClass}" id = "${card.mal_id}" > `

        } else {
            content += `<div class = "completeAnime" id = "${card.mal_id}"> `
        }

        if (imageCard === "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png") {
            content += `
            <img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" id = "${card.mal_id}" alt="${card.title}">  `;
            ;

        } else {
            content += `
           <img src="${imageCard}" alt="${card.title}" id = "${card.mal_id}">`
        }
        content += `

        <h3 id = "${card.mal_id}">${card.title}</h3>
        <div id = "${card.mal_id}"  class = "delButn ${deBtn}" >X</div>`;

        content += `</div>`

    });

    list.innerHTML += content;
}

function handleAddFavourites(event) {
    const inputiD = event.target.id;

    if (!event.target.id) {
        return;
    }
    console.log(inputiD);
    const animeindex = animesToShow.findIndex((anime) => {

        return anime.mal_id == inputiD;
    })

    // Compruebo si mi array nuevo favArray contiene el elemento clickado
    const isAlreadyFavourite = favArray.some((anime) => {
        return anime.mal_id == inputiD;
    });

    // si no lo contiene lo añado al array favArray
    if (!isAlreadyFavourite) {

        favArray.push(animesToShow[animeindex]);

    } else {

        handleRemoveFromFav(event);
    }
    seachResultsList.innerHTML = " ";
    renderCards(animesToShow, seachResultsList, "Resultado de búsqueda", "selected", "hidden");
    favouritesRender();

}
seachResultsList.addEventListener("click", handleAddFavourites);


function favouritesRender() {

    if (favArray.length <= 0) {

        FavouritesList.classList.add("hidden");
        masterContainer.classList.remove("reverse");
    }
    else {
        masterContainer.classList.add("reverse");
        FavouritesList.classList.remove("hidden");

        FavouritesList.innerHTML = " ";
        renderCards(favArray, FavouritesList, "Animes favoritos", "favsItems"); // renderiza el nuevo array

    }

    localStorage.setItem("favourites", JSON.stringify(favArray));
    const deleteButton = document.querySelectorAll(".delButn");
    deleteButton.forEach(button => {
        console.log(button);
        button.addEventListener("click", handleRemoveFromFav);
    })
}
function handleRemoveFromFav(event) {
    const inputFaviD = event.target.id;

    if (!event.target.id) {
        return;
    }
    const animeFavindex = favArray.findIndex((fav) => {
        return fav.mal_id == inputFaviD;
    })

    if (animeFavindex === -1) {
        console.log("El anime favorito no se encontró en favArray");

    } else {
        favArray.splice(animeFavindex, 1);
        favouritesRender();
    }

    seachResultsList.innerHTML = " ";
    renderCards(animesToShow, seachResultsList, "Resultado de búsqueda", "selected", "hidden");
}

resetBtn.addEventListener("click", () => {

    FavouritesList.innerHTML = "";
    seachResultsList.innerHTML = "";
    favArray.length = 0;
    localStorage.setItem("favourites", JSON.stringify(favArray));
    searchInput.value = "";
});