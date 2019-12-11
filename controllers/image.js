const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'ef9d4bc6225d4fbe8e3bf77f4c442504'
});

const handleAPICall = () => (req,res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
		.then(data => res.json(data))
		.catch(err => res.status(400).json('unable to work with Clarifai API'))
}

const handleImage = (db) =>  (req,res) => {
	const { id } = req.body;
	db('users').where({id})
		.increment('entries',1)
		.returning('entries')
		.then( entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('Error getting entries'))
}

module.exports = {
	handleImage,
	handleAPICall
};