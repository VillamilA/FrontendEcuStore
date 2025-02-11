$(document).ready(() => {
    var game = JSON.parse(sessionStorage.getItem('gameInfo'));
    var title = $('#gameTitle');
    title.append(game.title);
    var categories = $('#gameCategories');
    categories.append(game.category)
    var platform = $('#gamePlatform');
    platform.append(game.platform);
    var price = $('#gamePrice');
    price.append(game.price);
    var description = $('#gameDescription');
    description.append(game.description);
    var year = $('#gameYear');
    year.append(game.year);
    
    var gameImage = $('#gameImage')[0];
    // gameImage.attr('src', `data:image/jpg;base64,${sessionStorage.getItem('gameImage')}`)
    gameImage.src=`http://localhost:3000/game/${game.gameid}/image/`
})