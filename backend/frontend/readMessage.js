document.addEventListener('DOMContentLoaded', function() {
    readMessage()
    deleteMessageLink()
    updateMessageLink()
    isSignedIn()
})

function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function readMessage() {
    
        const readMessageBody = document.querySelector('#readMessageBody')
        const readTimestamp = document.querySelector('#readTimestamp')
        const readImage = document.querySelector('#image-container')

        const messageSentByProfile = document.querySelector('#messageSentByProfile')
        const messageRecievedByGroup = document.querySelector('#messageRecievedByGroup')

        
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
        const messageID = localStorage.getItem('messageID');

        // set message ID after clicked

        fetch(`/messagingApp/message/get/${messageID}/amessage`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userTokenSignedIn}`
            },
        })
        .then(response => response.json())
        .then(response => {
            readMessageBody.innerHTML = `<strong>Body:</strong> ${response.message.messageBody}`,
            readTimestamp.innerHTML = `<strong>Timestamp: </strong>${response.message.timestamp}`,
            console.log("resonse", response.message.image)
            if (response.message.image !== undefined) {
                const image = document.createElement(div)
                image.innerHTML = `<img src="${response.message.image}" class="readImage"  alt="conversation image"></img>`

                readImage.appendChild(image)
            }

            //readImage.src = response.message.image,
            messageSentByProfile.innerHTML = `<strong>Message Sender: </strong>${response.message.messageSentByProfile.username}`
        })    
        .catch(error => {
            console.log('Error:', error)
            document.getElementById("responseFeedback").textContent = `${error}`

        })
}

function deleteMessageLink() {
    document.querySelector('#deleteMessageLink').addEventListener('click', function(event) {
        event.preventDefault()
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
        const messageID = localStorage.getItem('messageID');

        fetch(`/messagingApp//message/delete/${messageID}`, {
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

function updateMessageLink() {
    document.querySelector('#updateMessageLink').addEventListener('click', function(event) {
        event.preventDefault()
        console.log("update click")
        window.location.href = "updateMessage.html";

    })
}