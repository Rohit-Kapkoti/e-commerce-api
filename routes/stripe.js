const router = require("express").Router;

const stripe = require ("stripe")(process.env.STRIPE_KEY);



router.post("/payments", (res, req) =>{
    stripe.charges.create({
        source : req.body.tokenId,
        amount: req.body.amount,
        currrency : "rupee",
    }, (strip))
})



module.exports = router;