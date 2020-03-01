const handleSignIn = (db, bcrypt) => (req,res) => {
	const {email, password} = req.body;
	if(!email || !password) {
		return res.status(422).json('incorrect form submission');
	}
	db.select('email','hash').from('userinfo')
	.where('email','=',email)
	.then(data => {
		//checking the first row beacuse the db sends the user in an array
		//checking if password matching the hash
		const isValid = bcrypt.compareSync(password, data[0].hash);
		console.log(isValid)
		if (isValid) {
			//returning the user
			return db.select('*').from('userinfo')
			.where('email','=',email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(422).json('Error getting user'))
		} else {
			// if password doesnt match hash
			res.status(401).json('Wrong credentials')
		}
	})
	.catch(err => res.status(401).json('Wrong credentials'))	 
}

module.exports = {
	handleSignIn: handleSignIn
};