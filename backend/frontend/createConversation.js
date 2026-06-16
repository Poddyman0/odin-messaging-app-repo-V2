document.addEventListener('DOMContentLoaded', function() {
    getFriends() 
    createConversation()
    isSignedIn()
})
function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}


function getFriends () {
    const addParticipantRadioContainer = document.getElementById('add-participants-radio-container')
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
            let aParticipantToDisplay = document.createElement('div')
            aParticipantToDisplay.innerHTML = 
            `
                <div class="form-check">
                <input class="form-check-input participantCheckBox" type="checkbox" value="${profile.username}" id="${profile._id}" >
                <label class="form-check-label" for="flexRadioDefault1">
                ${profile.username}
                </label>
                </div>
            `
            addParticipantRadioContainer.appendChild(aParticipantToDisplay)

        })
    })
    .catch(error => {
        console.log('Error:', error)
        document.getElementById("responseFeedback").innerHTML = `${error}`

    })
    
}

function createConversation() {
        document.querySelector('#btn-create-conversation').addEventListener('click', function(event) {
            event.preventDefault()
            const isGroup = document.querySelector('#isGroup');
            const conversationName = document.querySelector('#create-conversationName')
            const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');

    
            let createConversationBE = {
                isGroup: isGroup.checked,
                participants: [],
                conversationName: conversationName.value
            }
        
    
    
            document.querySelectorAll(".participantCheckBox").forEach((checkbox) => {
    
                if (checkbox.checked) {
                    createConversationBE.participants.push(
                        checkbox.id   
                    );
    
                }
    
            });
            const userId = localStorage.getItem('userIDSignedIn');

            createConversationBE.participants.push(userId)

            console.log("createConversationBE", createConversationBE)
    
            fetch('/messagingApp/conversation/post', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                    'Authorization': `Bearer ${userTokenSignedIn}`

                },
                body: JSON.stringify(createConversationBE)})
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