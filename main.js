const app = Vue.createApp({
    data: function () {
        return {
            roomCodes: [
                { id: 0, name: 'Default', numUsers: 0} //add time of creation
            ],
            userId: 0,
            selectedRoomId: 0,
            hasSubmitted: false,
            connection: null,
            tokens: 10
        }
    },
    methods: {
        addRoom(roomName) {
            roomCodes.push( {
                id: roomCodes.length,
                name: roomName,
                numUsers: 0
            })
        },
        joinRoom(index) {
            this.selectedRoomId = index
            this.hasSubmitted = true
            this.roomCodes[index].numUsers += 1
            document.getElementById("numTokens").innerText = this.tokens
        }
    },
    created: function () {
        let self = this
        console.log(self)
        console.log("Starting connection to WebSocket Server")
        this.connection = new WebSocket('ws://localhost:8081')
        
        this.connection.onopen = function(event) {
            console.log('Fontend connection to CrowdTraQ Server successful')
        }

        this.connection.onmessage = function(event) {

            const message = JSON.parse(event.data)
            if (message.UserId !== undefined) {
                this.userId = message.UserId
                console.log("Your assigned userID: " + this.userId);
            } else if (message.Tokens !== undefined){

                console.log(this)
                // self.tokens = message.Tokens
                self.set("tokens", message.Tokens)
                console.log("Tokens: " + this.tokens)
                // document.getElementById("numTokens").innerText = this.tokens
            }else if (message.Push_State !== undefined) {

                if (message.Push_State == 0) {
                    document.getElementsByClassName("img-col")[0].style.display = "inline-block"
                    document.getElementsByClassName("img-col")[1].style.display = "inline-block"
                }
            }else if (message.Error !== undefined) {
                switch(message.Error) {
                    case 0: 
                        alert("Not enough tokens to add to queue!")
                    case 1:
                        alert("Song already in queue!")
                }
            } else {
                console.log(message)
            }
          }
    }
})
