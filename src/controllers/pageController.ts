import { RequestHandler } from 'express'


export const home: RequestHandler = (req, res, next) => {

	const payload = {
		title: 'Home Page'
	}
	res.render('home/main', payload )

}