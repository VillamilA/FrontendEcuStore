$(document).ready(() => {
    $('#applyFilters').click(() => {
        var alert = $('.gameNotFoundAlert')[0];
        alert.hidden = true; // hide alert if its not hidden

        let categoryArray = $('#categoryList2').val();
        let platformArray = $('#platformList2').val();

        axios.get('http://localhost:3000/game/', {
            params: {
                title: $('#searchBar').val(),
                category: JSON.stringify(categoryArray),
                platform: JSON.stringify(platformArray)
            }
        })
        .then((res) => {
            // Remove previous entries
            prevAnchors = $('.gameAnchor');
            if (prevAnchors.length > 0) {
                for (let i = 0; i < prevAnchors.length; i++) {
                    prevAnchors[i].remove();
                }
            }
            // Add new entries
            var div = $('.gamesListingEntries')[0];
            for (let i = 0; i < res.data.length; i++) {
                var anchor = document.createElement('a');
                anchor.href = '../game.html'; 
                // need to add the link to the game page. possibly create 1 game.html page then for each anchor you give it a unique ID based on the game name. then when the anchor is clicked, get its ID and populate the page with that games information
                anchor.setAttribute('id',`${res.data[i].title}|${res.data[i].platform_name}`)
                anchor.classList.add('row')
                anchor.classList.add('gameAnchor')

                // Create image
                var img = document.createElement('img');
                img.src='../images/arcanestatue.jpeg'; // need to store image in SQL database and this needs to extract that image
                img.classList.add('col-sm-3')
                anchor.appendChild(img)
                
                // Create div for game title and game info
                var innerDiv = document.createElement('div');
                innerDiv.classList.add('col')
                // Create game title
                var h3 = document.createElement('h3');
                h3.innerHTML = res.data[i].title
                innerDiv.appendChild(h3)
                // Create game info
                var info = document.createElement('div');

                var platform = document.createElement('span');
                platform.innerHTML = res.data[i].platform_name;
                info.appendChild(platform);

                var price = document.createElement('span');
                if (res.data[i].price == '0') {
                    price.innerHTML = `Free`;
                } else {
                    price.innerHTML = `$${res.data[i].price}`;
                }
                price.setAttribute('class', 'gamePrice')
                info.appendChild(price);
                
                innerDiv.appendChild(info)
                anchor.appendChild(innerDiv)
                div.appendChild(anchor);

            }
        })
        .catch((err) => {
            if (err.response.request.status == 404) { //if game not found
                prevAnchors = $('.gameAnchor');
                if (prevAnchors.length > 0) { //remove all previous entries
                    for (let i = 0; i < prevAnchors.length; i++) {
                        prevAnchors[i].remove();
                    }
                }
                var alert = $('.gameNotFoundAlert')[0]; // alert that game not found
                alert.hidden = false;
            } else {
                console.log('err', err);
            };
        })
        return false;
    })
    jQuery('#applyFilters').click() // Automatically clicks #applyFilters when the page loads
})

