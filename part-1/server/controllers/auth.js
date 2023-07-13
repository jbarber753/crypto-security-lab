const bcrypt = require(`bcryptjs`)

const users = []

module.exports = {
    login: (req, res) => {
      console.log('Logging In User')
      const { username, password } = req.body
      let user
      for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
          user = users[i]
        }
      }
      if(!user){
        res.status(401).send(`Invalid credentials`)
      }
      else{
        bcrypt.compare(password, user.passwordHash, (err, result) => {
          if (err){
            res.status(400).send(`Problem during compare`)
          }
          else{
            if(!result){
              res.status(401).send(`Invalid credentials`)
            }
            else{
              res.status(200).send({username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName})
            }
          }
        })
      }
    },
    register: (req, res) => {
        console.log('Registering User')
        const { username, email, firstName, lastName, password } = req.body
        const saltRounds = 10
        bcrypt.hash(password, saltRounds, (err, hash) => {
          let newUser = {
            username,
            email,
            firstName,
            lastName,
            passwordHash: hash
          }
          if (err){
            res.status(400).send(`Problem during hash`)
          }
          else{
            users.push(newUser)
            res.status(200).send(req.body)
          }
        })
    }
}