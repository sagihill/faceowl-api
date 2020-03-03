//registration method
//the input is the user info
//the output is login and userinfo database insertion
//the method also return the registred user for signin process
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
				email: email,
				time: new Date()
			})
			.into('logins')
			.returning('email')
			.then(loginEmail => {
				//updating users table
				return db('userinfo')
				.returning('*')
				.insert({
					name: name,
					email: email,
					hash: hash,
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