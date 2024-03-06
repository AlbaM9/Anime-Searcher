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

    if (savedAnimes.length === 0) {

        masterContainer.classList.remove("reverse");
        FavouritesList.classList.add("hidden");

    } else {
        favArray = savedAnimes; //reasigno al inicio para funcionalidades. Si no no funciona la eliminacion
        masterContainer.classList.add("reverse");
        FavouritesList.classList.remove("hidden"); //cargan al inicio; evitar que se genere un nuevo array al pulsar nuscar por primera vez
        FavouritesList.innerHTML = " ";
        renderCards(savedAnimes, FavouritesList, "Animes Favoritos", "favsItems");

    }

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
                FavouritesList.innerHTML = " ";// reasigno para no perder el valor de array de favoritos guardado tras cada adición
                renderCards(savedAnimes, FavouritesList, "Animes Favoritos", "favsItems");

                if (savedAnimes.length === 0) {

                    FavouritesList.innerHTML = "";
                    masterContainer.classList.remove("reverse");
                }
            }

            favouritesRender();
        })

}
searchBtn.addEventListener("click", handleFilter);

function renderCards(animesData, list, title, styleClass, deBtn) {
    let content = `<h2>${title}</h2>`;
    animesData.forEach(card => {
        imageCard = card.images.jpg.image_url;

        if (card.myFavourite == true || savedAnimes && savedAnimes.some(savedAnime => savedAnime.mal_id === card.mal_id)) { //mantiene seleecionadas las tarjetas que se encuentran en el favArray

            content += `<div class = "completeAnime ${styleClass}" > `

        } else {
            content += `<div class = "completeAnime" > `
        }

        if (imageCard !== null) {
            content += `
           
            <img src="${imageCard}" alt="${card.title}" id = "${card.mal_id}">
            <h3 id = "${card.mal_id}">${card.title}</h3>
            <div id = "${card.mal_id}"  class = "delButn ${deBtn}" >X</div>`;

        } else {
            content += `
            <h3>${card.title}</h3>
            <img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="${card.title}">
            <div id = "${card.mal_id}"  class = "delButn ${deBtn}" >X</div>`;
        }
        content += `</div>`

    });

    list.innerHTML += content;


}

function handleAddFavourites(event) {
    const inputiD = event.target.id;

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
        animesToShow[animeindex].myFavourite = true;
        favArray.push(animesToShow[animeindex]);

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
}

function handleRemoveFromFav(event) {

    const inputFaviD = event.target.id;

    const animeFavindex = favArray.findIndex((fav) => {
        return fav.mal_id == inputFaviD;
    })

    if (animeFavindex === -1) {
        console.log("El anime favorito no se encontró en favArray");

    } else {

        favArray.splice(animeFavindex, 1);
        FavouritesList.innerHTML = "";
        renderCards(favArray, FavouritesList, "Animes favoritos", "favsItems");


        if (favArray.length === 0 || savedAnimes.length === 0) {

            FavouritesList.classList.add("hidden");
        }
    }
    localStorage.setItem("favourites", JSON.stringify(favArray));
}

FavouritesList.addEventListener("click", handleRemoveFromFav);

resetBtn.addEventListener("click", () => {

    FavouritesList.innerHTML = "";
    seachResultsList.innerHTML = "";
    favArray.length = 0;
    localStorage.setItem("favourites", JSON.stringify(favArray));
    searchInput.value = "";
});