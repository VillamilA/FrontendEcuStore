$(document).ready(() => {
    // For dropdowns
        axios.get('http://localhost:3000/platformsAndCategories')
        .then((res) => {
            var platformList = $('.platformList');
            res.data.platforms.forEach((platform) => {
                var option = document.createElement('option');
                option.setAttribute('value', platform.platform_name);
                option.innerHTML = platform.platform_name;
                platformList.append(option)
            });
            var categoryList = $('.categoryList');
            res.data.categories.forEach((category) => {
                var option = document.createElement('option');
                option.setAttribute('value', category.categoryid);
                option.innerHTML = category.catname;
                categoryList.append(option)
            });
        })
        .catch((err) => {
            console.log(err);
        })

    // Populate platforms for add new game section
    axios.get('http://localhost:3000/platformsAndCategories')
    .then((res) => {
        var platformDiv = $('.newGamePlatformDiv')[0];
        var priceDiv = $('.newGamePriceDiv')[0];
        res.data.platforms.forEach((platform) => {
            var checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('id', `${platform.platform_name}Platform`);
            checkbox.setAttribute('name', `${platform.platform_name}Platform`);
            checkbox.setAttribute('value', `${platform.platformid}`);
            checkbox.classList.add('newGamePlatformCheckbox');
            var checkboxLabel = document.createElement('label');
            checkboxLabel.innerHTML = platform.platform_name;
            checkboxLabel.setAttribute('for', `${platform.platform_name}Platform`);
            checkboxLabel.classList.add('newGamePlatformLabel');
            platformDiv.append(checkbox);
            platformDiv.append(checkboxLabel);
            platformDiv.append(document.createElement('br'));

            var input = document.createElement('input');
            input.setAttribute('id', `${platform.platformid}Price`)
            input.setAttribute('type','number');
            input.setAttribute('min','1');
            input.setAttribute('step','any');
            input.setAttribute('placeholder','$');
            input.classList.add('newGamePrice');
            priceDiv.append(input);
        });
    })
})