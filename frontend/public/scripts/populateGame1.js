$(document).ready(() => {
    $('#applyFilters').click(() => {
        setTimeout(() => {
            var gameAnchors = $('.gameAnchor');
            for (let i = 0; i < gameAnchors.length; i++) {
                $(gameAnchors[i]).click(() => {
                        var gameid = gameAnchors[i].getAttribute('data-gameid');
                        var platformid= gameAnchors[i].getAttribute('data-platformid');
                        axios.get(`http://localhost:3000/game/${gameid}/${platformid}`)
                        .then((res) => {
                            var gameInfo = {
                                'title': res.data.title,
                                'category': res.data.catname,
                                'description':res.data.description,
                                'platform':res.data.platform_name,
                                'price': res.data.price,
                                'year':res.data.year,
                                'gameid':gameid,
                                'platformid':platformid
                            }
                            location.assign('http://localhost:3001/game.html');
                            sessionStorage.setItem('gameInfo', JSON.stringify(gameInfo))
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    return false;
                })
            }
        }, 1000); // 1000ms timeout because it needs to wait for the whole document to load and a bit more in order to get the .gameAnchor classes    
    });
    jQuery('#applyFilters').click() // Automatically clicks #applyFilters when the page loads
});