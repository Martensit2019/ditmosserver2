require('dotenv').config()
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8000

app.post('/send-mail', async (req, res) => {
  const { recipientEmail, percent } = req.body
  console.log('recipientEmail, percent', recipientEmail, percent)

  const subject = 'Результаты опроса на площадке Открытый контроль'
  const html = `По результатам опроса Вы ответили неправильно на ${percent}% вопросов. В прикрепленном pdf файле список возможных нарушений`

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  })

  const mailOptions = {
    from: 'amazontrackerbiz@gmail.com',
    to: recipientEmail,
    subject,
    html,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      res.status(500).send('Error sending email')
    } else {
      console.log('Email sent:', info.response)
      res.status(200).send('Email sent successfull')
    }
  })
})

app.listen(PORT, function () {
  console.log(`Running on port ${PORT}`)
})
