const handleRegister =(db, bcrypt) => (req,res) => {
	const {email, name, password} = req.body;
	if(!email || !name || !password){
		return res.status(422).json('incorrect form submission');
	}
	//hashing
	const hash = bcrypt.hashSync(password);
		//entering the user info into login table
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(email => {
				//updating users table
				return db('users')
				.returning('*')
				.insert({
					name: name,
					email: email,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
			})
			//commiting the transaction
			.then(trx.commit)
			//if error is catched rolling back the changes
			.catch(trx.rollback)
		})
	.catch(err => res.status(422).json('Unable to register'))
}

module.exports = {
	handleRegister: handleRegister
};