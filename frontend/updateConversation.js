document.addEventListener('DOMContentLoaded', function() {
    getAllProfiles()
    getConversation()
    isSignedIn()
})

function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function getAllProfiles() {
        const participants = document.querySelector('#add-participants-radio-container')      
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
        //const conversationID = localStorage.getItem('conversationID');
        // set message ID after clicked

        fetch(`http://localhost:3000/messagingApp/profiles/get`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userTokenSignedIn}`
            },
        })
        .then(response => response.json())
        .then(response => {
            console.log("response", response)
            response.profiles.forEach(participant =>{
                let aParticipantToDisplay = document.createElement('div')
                aParticipantToDisplay.id = `${participant._id}`
                aParticipantToDisplay.innerHTML =         `
                <div class="form-check">
                <input class="form-check-input participantCheckBox" type="checkbox" value="${participant.username}" id="${participant._id}" >
                <label class="form-check-label" for="flexRadioDefault1">
                ${participant.username}
                </label>
                </div>
            `
                
                participants.appendChild(aParticipantToDisplay)
            })


        })    
        .catch(error => {
            console.log('Error:', error)
            document.getElementById("responseFeedback").textContent = `${error}`

        })
}

function getConversation() {
        const isGroup = document.querySelector('#isGroupID')
        const conversationName = document.querySelector('#update-conversationName')
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
                    conversationName.value = response.conversation.conversationName
                    isGroup.checked = response.conversation.isGroup
                    response.conversation.participants.forEach((participant) => {
                        document.querySelectorAll(".participantCheckBox").forEach((checkbox) => {
                            if (participant._id === checkbox.id) {
                                checkbox.checked = true
                            }
    
                
                        });
                    })
                    updateConversation()
                })
                .catch(error => {

                });
}

function updateConversation () {
    document.querySelector('#btn-update-conversation').addEventListener('click', function(event) {
        event.preventDefault()
        const isGroup = document.querySelector('#isGroupID')
        const conversationName = document.querySelector('#update-conversationName')

        let conversationID = localStorage.getItem('conversationID')
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn')
        
        const updateConversationBE = {
            isGroup: isGroup.checked,
            participants: [],
            conversationName: conversationName.value,
            _id: `${conversationID}`
        }

        document.querySelectorAll(".friendCheckBox").forEach((checkbox) => {

            if (checkbox.checked) {
                updateConversationBE.participants.push(
                    checkbox.id   
                );

            }

        });


        fetch(`http://localhost:3000/messagingApp/conversation/put/${conversationID}/conversationupdate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userTokenSignedIn}`
            },
            body: JSON.stringify(updateConversationBE)
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