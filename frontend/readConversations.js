document.addEventListener('DOMContentLoaded', function() {
    readConversations()
    isSignedIn()
    createConversationLink()
})

function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function readConversations() {
        const conversationsDisplay = document.querySelector('#conversations-display')

        const userId = localStorage.getItem('userIDSignedIn');
        console.log("hi")
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');

        fetch(`http://localhost:3000/messagingApp/conversation/get/conversations/${userId}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'aapplication/json',
            'Authorization': `Bearer ${userTokenSignedIn}`
            },
        })
        .then(response => response.json())
        .then(response => {
            console.log("response", response)
            response.conversations.forEach((conversation) => {
                let aConversationToDisplay = document.createElement('div')
                aConversationToDisplay.className = "aCard"
                aConversationToDisplay.id = `card-id-${conversation._id}`
                aConversationToDisplay.innerHTML = `
                <div class="card-body">
                    <p class="card-text" id="conversationName"><strong>Conversation Name: </strong> ${conversation.conversationName}</p>
                    <p class="card-text" id="isGroup"><strong>Is this a group chat? </strong> ${conversation.isGroup}</p>
                    <ul class="card-text" id="participants"><strong>Participants: </ul>                   
                    <button class="btn btn-success conversationLink">View Conversation</button>
                </div>
                <br>
                `
                const participantsUL = aConversationToDisplay.querySelector('#participants');

                conversation.participants.forEach(participant => {
                    console.log("participant", participant)
                    let participants = document.createElement('li')
                    participants.innerHTML = `${participant.username}`
                    participantsUL.appendChild(participants)

                })
                const conversationButton = aConversationToDisplay.querySelector('.conversationLink');

                // FIXED addEventListener syntax
                conversationButton.addEventListener('click', () => {
        
                    localStorage.setItem('conversationID', conversation._id);
        
                    window.location.href = "readConversation.html";
        
                });
                conversationsDisplay.appendChild(aConversationToDisplay);
            })

            
        })
        .catch(error => {
            console.log('Error:', error)
            document.getElementById("responseFeedback").textContent = `${error}`

        })
    }

    function createConversationLink () {
        document.getElementById("create-convo-button").addEventListener("click", function(event) {
            event.preventDefault()
            window.location.href = "createConversation.html"
        })
    }