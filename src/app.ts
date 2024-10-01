import path from 'node:path'
import express from 'express'
import livereload from 'livereload'
import connectLivereload from 'connect-livereload'
import routes from './routes'
import dotenv from 'dotenv'
dotenv.config() 	


const publicDirectory = path.join(process.cwd(), './src/public')
const app = express()


app.set('views', path.join(process.cwd(), './src/views'));
app.set('view engine', 'pug');

// -----[ For LiveReload ]-----
if(process.env.NODE_ENV === 'development') {
	const livereloadServer = livereload.createServer() 				// for reload browser
	livereloadServer.watch(publicDirectory)
	livereloadServer.server.once('connection', () => {
		setTimeout(() => livereloadServer.refresh('/') , 100);
	})

	app.use(connectLivereload({ 	// add livereload script in front-end to listen 
		// port: 35729,
		src: "http://127.0.0.1:35729/livereload.js?snipver=1",
		ignore: ['.js', '.svg'],
	})) 
}


app.use(express.static(publicDirectory));
app.use(routes)


const PORT = 5000
app.listen(PORT, () => {
	console.log(`server is listening on: http://localhost:${PORT}`)
})




