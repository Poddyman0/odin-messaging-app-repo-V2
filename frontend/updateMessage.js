document.addEventListener('DOMContentLoaded', function() {
    getMessage()
    isSignedIn()
})

function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

   // set message ID after clicked
function getMessage() {
    const messageBody = document.querySelector('#messageBody-update')
    const image = document.querySelector('#image-update')

    
    
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    const messageID = localStorage.getItem('messageID');


    fetch(`http://localhost:3000/messagingApp/message/get/${messageID}/amessage`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userTokenSignedIn}`
        },
    })
    .then(response => response.json())
    .then(response => {
        messageBody.value = response.message.messageBody
        image.value = response.message.image




    })    
    .catch(error => {
        document.getElementById("responseFeedback").textContent = `${error}`

    })
}

function updateMessage () {
    document.querySelector('#btn-message-update').addEventListener('click', function(event) {
        event.preventDefault()
        const messageBody = document.querySelector('#messageBody-update')
        const image = document.querySelector('#image-update')
        let conversationID = localStorage.getItem('conversationID')

        const userId = localStorage.getItem('userIDSignedIn');

        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn')
        const updateProfileBE = {
            messageBody: messageBody.value,
            image: image.value,
            conversationID: conversationID,
            messageSentByProfile: userId,
            _id: `${messageID}`
        }


    
        

        fetch(`http://localhost:3000/messagingApp/message/put/${messageID}/messageupdate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userTokenSignedIn}`
            },
            body: JSON.stringify(updateProfileBE)
          })
          .then(response => response.json())
          .then(response => { 
            document.getElementById("responseFeedback").textContent = `${response.msg}`


          })
          .catch(error => {
            console.error('Error:', error);
            });


    })
}