$(document).ready(() => {
    axios.get('http://localhost:3000/platformsAndCategories/')
    .then((res) => {
        // Add new entries
        var div = $('.filterCategories')[0];
        for (let i = 0; i < res.data.categories.length; i++) {
            var category = res.data.categories[i].catname;
            var input = document.createElement('input');
            input.setAttribute('type','checkbox');
            input.setAttribute('id',`cat${category}`);
            input.setAttribute('name',`cat${category}`);
            input.setAttribute('value',`${category}`);
            input.setAttribute('class',`categoryCheckbox`);
            // input.checked = true;
            var label = document.createElement('label');
            label.setAttribute('for', `cat${category}`);
            label.innerHTML = `${category}`;
            div.appendChild(input);
            div.appendChild(label);
            div.appendChild(document.createElement('br'));
        }
        var div = $('.filterPlatforms')[0];
        for (let i = 0; i < res.data.platforms.length; i++) {
            var platform = res.data.platforms[i].platform_name;
            var input = document.createElement('input');
            input.setAttribute('type','checkbox');
            input.setAttribute('id',`plat${platform}`);
            input.setAttribute('name',`plat${platform}`);
            input.setAttribute('value',`${platform}`);
            input.setAttribute('class',`platformCheckbox`);
            // input.checked = true;
            var label = document.createElement('label');
            label.setAttribute('for', `plat${platform}`);
            label.innerHTML = `${platform}`;
            div.appendChild(input);
            div.appendChild(label);
            div.appendChild(document.createElement('br'));
        }
    })
    .catch((err) => {
        console.log('err', err);
    })
})

