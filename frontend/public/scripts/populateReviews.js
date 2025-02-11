$(document).ready(() => {
    var gameid = JSON.parse(sessionStorage.gameInfo).gameid;
    axios.get(`http://localhost:3000/game/${gameid}/review`)
    .then((res) => {
        res.data.forEach((review) => {

        var user = review.username;
        var content = review.content;
        var rating = review.rating;
        var created_at = review.created_at;

        var parent = $('.reviews')[0];
        var individualReview = document.createElement('div');
        individualReview.classList.add('individualReview');
        individualReview.classList.add('row');

        var usernameDiv = document.createElement('div');
        usernameDiv.classList.add('displayTable');
        usernameDiv.classList.add('col-3');
        var h2 = document.createElement('h2');
        h2.classList.add('reviewUsername');
        h2.innerHTML = user;
        usernameDiv.append(h2);
        individualReview.append(usernameDiv);

        var contentDiv = document.createElement('div');
        contentDiv.classList.add('reviewContent');
        contentDiv.classList.add('col-9');

        var ratingDiv = document.createElement('div');
        ratingDiv.classList.add('reviewRating');
        ratingDiv.innerHTML = `Rating: ${rating}/5`;

        var reviewTextDiv = document.createElement('div');
        reviewTextDiv.classList.add('reviewText');
        reviewTextDiv.innerHTML = content;

        var createdAtDiv = document.createElement('div');
        createdAtDiv.classList.add('reviewCreatedAt');
        createdAtDiv.innerHTML = `Posted on ${created_at}`

        contentDiv.append(ratingDiv);
        contentDiv.append(reviewTextDiv);
        contentDiv.append(createdAtDiv);
        individualReview.append(contentDiv);

        parent.append(individualReview);
        })
    })
    .catch((err) => {
        console.log(err)
    })
})