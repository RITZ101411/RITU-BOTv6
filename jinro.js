class jinroclass{
	constructor(client){
		this.client = client
	}
    async sendDM(userId) {
        this.client.users.cache.get(userId).send("message")
		
    }
}

module.exports = jinroclass;