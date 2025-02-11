$(document).ready(() => {
    $('#applyFilters').click(() => {
        var alert = $('.gameNotFoundAlert')[0];
        alert.hidden = true; // hide alert if its not hidden

        let categoryArray = (function() {
            let arr = [];
            $(".categoryCheckbox:checkbox:checked").each(function() { // gets all checked checkboxes with the class .category
                arr.push(this.value); // push each checkbox value into the array arr
            });
            return arr;
        })()
        let platformArray = (function() {
            let arr = [];
            $(".platformCheckbox:checkbox:checked").each(function() {
                arr.push(this.value);
            });
            return arr;
        })()

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
                // if (res.data[i].gameid == undefined) {
                //     continue;
                // }
                var anchor = document.createElement('a');
                anchor.classList.add('row');
                anchor.classList.add('gameAnchor');
                anchor.setAttribute('data-gameid', res.data[i].gameid);
                anchor.setAttribute('data-platformid', res.data[i].platformid)

                // Create image
                var img = document.createElement('img');
                // img.src='../images/arcanestatue.jpeg'; // need to store image in SQL database and this needs to extract that image
                img.src=`http://localhost:3000/game/${res.data[i].gameid}/image`;
                img.classList.add('col-sm-3');
                anchor.appendChild(img);
                
                // Create div for game title and game info
                var innerDiv = document.createElement('div');
                innerDiv.classList.add('col');
                // Create game title
                var h3 = document.createElement('h3');
                h3.innerHTML = res.data[i].title;
                innerDiv.appendChild(h3);

                // Create game info
                var info = document.createElement('div');
                // Create game platform
                var platform = document.createElement('span');
                platform.innerHTML = res.data[i].platform_name;
                info.appendChild(platform);
                // Create game price
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
            console.log(err)
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

