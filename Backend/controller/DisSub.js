const asyncHandler = require('express-async-handler')
const Dist = require('../model/Dist-subdivision')

const setDisSub = asyncHandler(async(req, res) => {
    const { District, Subdivision } = req.body
    if (!District || !Subdivision) {
        res.status(400)
        throw new Error('Please add a new text field')
    }

    const Sub_Dis = await Dist.create({
        District,
        Subdivision,
    })
    if (Sub_Dis) {
        res.status(200).json({
            District: Sub_Dis.District,
            Subdivision: Sub_Dis.Subdivision,
        })
    }
    console.log(Sub_Dis);
})

module.exports = {setDisSub}
