var token= localStorage.getItem('token')
axios.get(`http://localhost:3000/verifyAdmin/${token}`, {
    headers: {'authorization':`Bearer ${localStorage.getItem('token')}`}
})
.then((res) => {
    return false;
})
.catch((err) => {
    if (err.response.status == 403) {
        location.assign('http://localhost:3001/403.html');
        return;
    }
    console.log(err)
    // location.assign('http://localhost:3001/403.html')
})