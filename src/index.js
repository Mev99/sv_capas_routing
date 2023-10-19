import Express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars"
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
//CONFIG & UTILS
import __dirname from "./utils.js";
import config from "./config/config.js"
import initializePassport from "./config/passport.config.js";
//ROUTERs
import userRouter from "./router/users.router.js"
import productRouter from "./router/product.router.js";
import cartRouter from "./router/cart.router.js";


const app = Express()

const mongoURL = config.mongoUrl
const PORT = config.port

app.engine(
    "handlebars",
    engine({
        extname: "handlebars",
        defaultLayout: false,
        layoutsDir: "views/layouts/"
    })
);
app.set("view engine", "handlebars")
app.set("views", __dirname + '/views')
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

app.listen(PORT, () => {
    console.log(`at port: ${PORT}`)
})

mongoose.connect(mongoURL)
    .then(() => {
        console.log('connected to DB')
    })
    .catch(error => {
        console.error('error connecting to DB', error)
    })

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://Mev:1972@cluster0.kxayelo.mongodb.net/ecommerce?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 600,
    }),
    secret: 'coderSecret',
    resave: false,
    saveUninitialized: true,
}))

// PASSPORT
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//ROUTERS
app.use('/user', userRouter)
app.use('/products', productRouter)
app.use('/cart', cartRouter)