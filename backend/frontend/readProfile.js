document.addEventListener('DOMContentLoaded', function() {
    readProfile()
    deleteProfileLink()
    updateProfileLink()
    signOutButton()
    isSignedIn()
})
function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function readProfile() {
    
        const readUsername = document.querySelector('#readUsername')
        const readEmail = document.querySelector('#readEmail')
        const readProfileSignedIn = document.querySelector('#readProfileSignedIn')
        const readFriends = document.querySelector('#readFriends')

        const userId = localStorage.getItem('userIDSignedIn');
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
        console.log("userTokenSignedIn", userTokenSignedIn)


        fetch(`/messagingApp/profile/get/${userId}/aprofileID`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userTokenSignedIn}`
            },
        })
        .then(response => response.json())
        .then(response => {
            console.log("response", response)
            readUsername.innerHTML = `Username: ${response.profile.username}`
            readEmail.innerHTML = `Email: ${response.profile.email}`,
            readProfileSignedIn.innerHTML = `Profile Signed In: ${response.profile.profileSignedIn}`,
            //readFriends.innerHTML = `Friends: ${response.profile.friends}`,
            console.log("friends", response.profile.friends)
            response.profile.friends.forEach((friend) => {
                console.log("friend", friend)
                let aFriendToDisplay = document.createElement('div')
                aFriendToDisplay.className = "aFriendCard"
                aFriendToDisplay.id = `${friend._id}`
                aFriendToDisplay.innerHTML = 
                `<li>${friend.username}</li>`
                readFriends.appendChild(aFriendToDisplay)
            })

        })    
        .catch(error => {
            console.log('Error:', error)
            document.getElementById("responseFeedback").textContent = `${error}`

        })
}

function deleteProfileLink() {
    document.querySelector('#deleteProfileLink').addEventListener('click', function(event) {
        event.preventDefault()
        const userId = localStorage.getItem('userIDSignedIn');
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');

        fetch(`/messagingApp/profile/delete/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                'Authorization': `Bearer ${userTokenSignedIn}`

            },
            body: JSON.stringify()})

                .then(response => response.json())
                .then(response => {
                    document.getElementById("responseFeedback").textContent = `${response.msg}`
                    localStorage.removeItem('userIDSignedIn');
                    localStorage.removeItem('userTokenSignedIn');
                })
                .catch(error => {
                    console.log('Error:', error);
                    document.getElementById("responseFeedback").textContent = `${response.msg}`

                });
    })

}

function updateProfileLink() {
    document.querySelector('#updateProfileLink').addEventListener('click', function(event) {
        event.preventDefault()
        console.log("update click")
        window.location.href = "updateProfile.html";

    })
}

function signOutButton() {
    document.getElementById("signOut").addEventListener('click', function() {
        const userId = localStorage.getItem('userIDSignedIn');
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
        console.log("click")
        const signOutProfileBD ={

        }
        fetch(`/messagingApp/profile/put/signout/${userId}/JWTBycrypt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                'Authorization': `Bearer ${userTokenSignedIn}`

            },
            body: JSON.stringify(signOutProfileBD)})

                .then(response => response.json())
                .then(response => {
                    document.getElementById("responseFeedback").textContent = `${response.msg}`
                    // may not need token
                    console.log("response 1", response)
                    localStorage.removeItem('userTokenSignedIn');
                    console.log("response 2", userId)

                    //
                    fetch(`/messagingApp/profile/put/signout/${userId}/passport`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
            
                        },
                        body: JSON.stringify(signOutProfileBD)})
                        .then(response => response.json())
                        .then(response => {
                            console.log("response 3", response)
                            localStorage.removeItem('userIDSignedIn');

                            window.location.href = "signInForm.html";

                        })
                        .catch(error => {
                            console.log("error", error)

                        })

                    //
                })
                .catch(error => {
                    console.log('Error:', error);
                    document.getElementById("responseFeedback").textContent = `${response.msg}`

                });



    })
}