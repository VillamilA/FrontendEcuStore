$(document).ready(() => {
    $('#pageGames').click(() => {
        var game = $('.addGame')[0];
        var platform = $('.addPlatform')[0];
        game.hidden = false;
        platform.hidden = true;
        var game = document.querySelector('#pageGames');
        var platform = document.querySelector('#pagePlatforms');
        game.classList.add('active');
        platform.classList.remove('active');
    })
    $('#pagePlatforms').click(() => {
        var game = $('.addGame')[0];
        var platform = $('.addPlatform')[0];
        game.hidden = true;
        platform.hidden = false;
        var game = document.querySelector('#pageGames');
        var platform = document.querySelector('#pagePlatforms');
        game.classList.remove('active');
        platform.classList.add('active');
    })
})