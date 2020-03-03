const Clarifai = require('clarifai');

// Clarifai api key
const app = new Clarifai.App({
 apiKey: 'ef9d4bc6225d4fbe8e3bf77f4c442504'
});

//the method for using the face recogintion api
//the input is the image url
const handleAPICall = () => (req,res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
		 //using first face for calculation
    	//can be scaled up for more than one face
		.then(data => res.json(data.outputs[0].data.regions[0].region_info.bounding_box))
		.catch(err => res.status(500).json('unable to work with Clarifai API'))
}

//method for incrementing user rank
const handleUserRankIncrement = (db) =>  (req,res) => {
	const { id } = req.body;
	db('userinfo').where({id})
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