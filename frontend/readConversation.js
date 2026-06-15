document.addEventListener('DOMContentLoaded', function() {
    readConversation()
    deleteConversationLink()
    updateConversationLink()
    createMessage() 
    isSignedIn()
})
function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function readConversation() {
    
        const conversationName = document.querySelector('#conversationName')
        const isGroup = document.querySelector('#isGroup')
        const participants = document.querySelector('#participants')
        participants.className = "dropdown-menu"
        const userId = localStorage.getItem('userIDSignedIn');

        
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
        //const conversationID = localStorage.getItem('conversationID');
        let conversationID = localStorage.getItem('conversationID')
        // set message ID after clicked

        fetch(`http://localhost:3000/messagingApp/conversation/get/${conversationID}/aconversation`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userTokenSignedIn}`
            },
        })
        .then(response => response.json())
        .then(response => {
            console.log("response", response)
            conversationName.innerHTML = `<strong>Conversation Name:</strong> ${response.conversation.conversationName}`



            response.conversation.participants.forEach((participant) =>{
                let aParticipantToDisplay = document.createElement('div')
                aParticipantToDisplay.className = "aParticipantCard"
                aParticipantToDisplay.id = `${participant._id}`
                aParticipantToDisplay.innerHTML = `
                <div  id="participant-username"><strong>Username: </strong>${participant.username}</div>
                <div id="participant-profileSignedIn"><strong>Is Signed In: </strong>${participant.profileSignedIn}</div>
                `
                
                participants.appendChild(aParticipantToDisplay)
            })
            response.conversation.messages.forEach((message) => {

                let aMessageToDisplay = document.createElement('div')
                aMessageToDisplay.id = `${message._id}`
                aMessageToDisplay.innerHTML = `
                     <div><strong>${message.messageSentByProfile.username} at ${message.timestamp}</strong></div>
                    <div>${message.messageBody}</div>
                    <img class="conversation-image" src="${message.image}" alt="conversation image">
                    <div class="read-message"></div>`
                console.log("message", message)
                console.log("message._id", message._id)


                if (message.messageSentByProfile._id === userId) {

                    aMessageToDisplay.className = "user-message";
                
                    const readMessageButtonContainer =
                        aMessageToDisplay.querySelector('.read-message');
                
                    readMessageButtonContainer.innerHTML = `
                        <button style="color: white" class="btn btn-success btn-outline-success read-message-button" id="${message._id}">
                            View, Update or Delete Message
                        </button>
                    `;
                
                    aMessageToDisplay
                        .querySelector('.read-message-button')
                        .addEventListener('click', function(event) {
                            event.preventDefault();
                            console.log("readMesageButton", event.target.id)
                            console.log("message._id", message._id)
                            localStorage.setItem('messageID', message._id);
                
                            window.location.href = "readMessage.html";
                        });
                
                } else {
                    aMessageToDisplay.className = "participant-message";
                }
                const messages = document.querySelector('#messages')

                messages.appendChild(aMessageToDisplay)

            })




        })    
        .catch(error => {
            console.log('Error:', error)
            document.getElementById("responseFeedback").textContent = `${error}`

        })
}


function createMessage () {
    document.querySelector('#btn-send-message').addEventListener('click', function(event) {
        event.preventDefault()
        const messageBody = document.querySelector('#create-message-body');
        const image = document.querySelector('#create-image')

        const userId = localStorage.getItem('userIDSignedIn');
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
        let conversationID = localStorage.getItem('conversationID')

        console.log("messageBody", messageBody.value)
        
        const createMessageBE = {
            messageBody: messageBody.value,
            image: image.value,
            messageSentByProfile: userId,
            conversationID: conversationID
        }
        fetch('http://localhost:3000/messagingApp/message/post', {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                'Authorization': `Bearer ${userTokenSignedIn}`

            },
            body: JSON.stringify(createMessageBE)})
                .then(response => response.json())
                .then(response => {
                    console.log("response", response)
                    document.getElementById("responseFeedback").textContent = `${response.msg}`
                    window.location.href = "readConversation.html";


                })
                .catch(error => {
                    console.log('Error:', error);
                    document.getElementById("responseFeedback").textContent = `${error}`

                });
    })
}


function deleteConversationLink() {
    document.querySelector('#deleteConversationLink').addEventListener('click', function(event) {
        event.preventDefault()

        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
        let conversationID = localStorage.getItem('conversationID')

        fetch(`http://localhost:3000/messagingApp/conversation/delete/${conversationID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                'Authorization': `Bearer ${userTokenSignedIn}`

            },
            body: JSON.stringify()})

                .then(response => response.json())
                .then(response => {
                    document.getElementById("responseFeedback").textContent = `${response.msg}`

                })
                .catch(error => {
                    console.log('Error:', error);
                    document.getElementById("responseFeedback").textContent = `${response.msg}`

                });
    })

}

function updateConversationLink() {
    document.querySelector('#updateConversationLink').addEventListener('click', function(event) {
        event.preventDefault()
        console.log("update click")
        window.location.href = "updateConversation.html";

    })
}