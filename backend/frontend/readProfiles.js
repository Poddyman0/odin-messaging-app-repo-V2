document.addEventListener('DOMContentLoaded', function() {
    readProfiles()
    isSignedIn()
})

function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function readProfiles() {
    const profilesDisplay = document.querySelector('#profiles-display')


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
                console.log("profile", profile)
                let aProfileToDisplay = document.createElement('div')
                aProfileToDisplay.className = "aCard"
                aProfileToDisplay.id = `${profile._id}`
                aProfileToDisplay.innerHTML = `
                    <div class="card-text" id="profile-username"><strong>Username: </strong> ${profile.username}</div>
                    <div class="card-text" id="profile-email"><strong>Email: </strong> ${profile.email}</div>
                    <div class="card-text" id="profile-profileSignedIn"><strong>Is Profile Signed In: </strong> ${profile.profileSignedIn}</div>
                `
                profilesDisplay.appendChild(aProfileToDisplay);

            })
        })
        .catch(error => {
            console.log('Error:', error)
            document.getElementById("responseFeedback").textContent = `${error}`

        })
        
}