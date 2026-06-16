document.addEventListener('DOMContentLoaded', function() {
    signUpForm()
    getFriends() 
})

function getFriends () {
    const addFriendRadioContainer = document.getElementById('add-friends-radio-container')
    const userId = localStorage.getItem('userIDSignedIn');
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    fetch(`/messagingApp/profiles/get`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userTokenSignedIn}`
        },
    })
    .then(response => response.json())
    .then(response => {
        response.profiles.forEach((profile) => {
            let aFriendToDisplay = document.createElement('div')
            aFriendToDisplay.innerHTML = 
            `
                <div class="form-check">
                <input class="form-check-input friendCheckBox" type="checkbox" value="${profile.username}" id="${profile._id}" >
                <label class="form-check-label" for="flexRadioDefault1">
                ${profile.username}
                </label>
                </div>
            `
            addFriendRadioContainer.appendChild(aFriendToDisplay)

        })
    })
    .catch(error => {
        console.log('Error:', error)
        document.getElementById("responseFeedback").textContent = `${error}`

    })
    
}

function signUpForm () {


    document.querySelector('#btn-sign-up').addEventListener('click', function(event) {
        event.preventDefault()
        const name = document.querySelector('#name-sign-up');
        const email = document.querySelector('#email-sign-up')
        const password = document.querySelector('#password-sign-up')
        

        let createProfileBE = {
            username: name.value,
            email: email.value,
            password: password.value,
            profileSignedIn: false,
            friends: []
        }


        document.querySelectorAll(".friendCheckBox").forEach((checkbox) => {

            if (checkbox.checked) {
                createProfileBE.friends.push(
                    checkbox.id   
                );

            }

        });
        console.log("createProfileBE", createProfileBE)

        fetch('/messagingApp/profile/post', {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(createProfileBE)})
                .then(response => response.json())
                .then(response => {
                    console.log("response", response)
                    document.getElementById("responseFeedback").textContent = `${response.msg}`


                })
                .catch(error => {
                    console.log('Error:', error);
                    document.getElementById("responseFeedback").textContent = `${error}`

                });
    })
}
