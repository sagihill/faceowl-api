//profile method
//currently there is no frontend implemtation for this capabilty
const handleProfile = (db) => (req,res) => {
	const { id } = req.params;
	db.select('*').from('userinfo').where({id})
		.then( user => {
			if(user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('User not found');
			}	
		})
		.catch(err => res.status(400).json('Error getting user'))
}

module.exports = {
	handleProfile: handleProfile
};