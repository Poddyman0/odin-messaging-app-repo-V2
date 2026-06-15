document.addEventListener('DOMContentLoaded', function() {
    getFriends()

    getProfile()
    isSignedIn()
})

function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function getFriends() {

    const addFriendRadioContainer = document.getElementById('add-friends-radio-container')
    const userId = localStorage.getItem('userIDSignedIn');
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    fetch(`http://localhost:3000/messagingApp/profiles/get`, {
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

function getProfile() {
    const name = document.querySelector('#name-update');
    const email = document.querySelector('#email-update')
    const password = document.querySelector('#password-update')


    
    const userId = localStorage.getItem('userIDSignedIn');
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');

    fetch(`http://localhost:3000/messagingApp/profile/get/${userId}/aprofileID`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${userTokenSignedIn}`
            },
        body: JSON.stringify()})
            .then(response => response.json())
            .then(response => {
                console.log("response", response.profile.friends)
                name.value = response.profile.username,
                email.value = response.profile.email,
                response.profile.friends.forEach((friend) => {
                    document.querySelectorAll(".friendCheckBox").forEach((checkbox) => {
                        if (friend._id === checkbox.id) {
                            checkbox.checked = true
                        }

            
                    });

                })


                updateProfile ()
            })
            .catch(error => {

            });

}

function updateProfile () {
    document.querySelector('#btn-update').addEventListener('click', function(event) {
        event.preventDefault()
        const name = document.querySelector('#name-update');
        const email = document.querySelector('#email-update')
        const password = document.querySelector('#password-update')

        const userId = localStorage.getItem('userIDSignedIn');
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn')
        const updateProfileBE = {
            username: name.value,
            email: email.value,
            password: password.value,
            friends: [],
            _id: `${userId}`
        }

        document.querySelectorAll(".friendCheckBox").forEach((checkbox) => {

            if (checkbox.checked) {
                updateProfileBE.friends.push(
                    checkbox.id   
                );

            }

        });
        console.log("UDPF", updateProfileBE)


        fetch(`http://localhost:3000/messagingApp/profile/put/${userId}/profileupdate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userTokenSignedIn}`
            },
            body: JSON.stringify(updateProfileBE)
          })
          .then(response => response.json())
          .then(response => { 
            console.log("reponse", response)
            document.getElementById("responseFeedback").textContent = `${response.msg}`


          })
          .catch(error => {
            });


    })
}