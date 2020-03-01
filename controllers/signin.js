const handleSignIn = (db, bcrypt) => (req,res) => {
	const {email, password} = req.body;
	if(!email || !password) {
		return res.status(422).json('incorrect form submission');
	}
	db.select('email','hash').from('users')
	.where('email','=',email)
	.then(data => {
		//checking the first row beacuse the db sends the user in an array
		//checking if password matching the hash
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if (isValid) {
			db.transaction(trx => {
				trx.insert({
					hash: hash,
					email: email,
					time: new Date()
				})
				.into('login')
				.returning('email')
				.then(email => {
					//returning the user
					return db.select('*').from('users')
					.where('email','=',email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(422).json('Error getting user'))
				})
				//commiting the transaction
				.then(trx.commit)
				//if error is catched rolling back the changes
				.catch(trx.rollback)
			})
		} else {
			// if password doesnt match hash
			res.status(401).json('Wrong credentials')
		}	 
		.catch(err => res.status(422).json('Unable to sign in'))
	}
}

module.exports = {
	handleSignIn: handleSignIn
};