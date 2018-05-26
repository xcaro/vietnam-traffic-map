const express = require('express')
const app = express()
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

/**
 * Body parse Json
 */
app.use(express.json())
app.post('/trafficReport', upload.array('images'), (req, res) => {
    /**
     * Get params
     */

     /**
      * Validate data : 
      * location : lat, lng, require
      * images : image, not require
      * reportTrafficType : str, require
      * description : str, not require
      */
     console.log(req.files)

      /**
       * Check if they need to link
       * Iterate all report
       * Get difference and convert deg to km
       * If in range then link them it
       */

       /**
        * Add more property such as
        * Comment,
        * Link
        */


    /**
     * Finally push' em to firebase
     */
    res.json(req.body)
})

app.listen(3000, () => console.log('Server listening on port 3000!'))