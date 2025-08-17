require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const nodemailer = require('nodemailer')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log('Тип запроса:', req.headers['content-type'])
  console.log('Доступны ли данные:', req.body ? 'Да' : 'Нет')
  next()
})

const PORT = process.env.PORT || 8000

// Конфигурация multer для хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads') // создайте папку uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // ограничение в 5MB
  },
})

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})

app.post('/send-mail', upload.single('file'), async (req, res) => {
  try {
    const { recipientEmail, percent } = req.body
    const file = req.file

    const subject = 'Результаты опроса на площадке Открытый контроль'
    const html = `По результатам опроса Вы ответили неправильно на ${percent}% вопросов. В прикрепленном pdf файле список возможных нарушений`

    const mailOptions = {
      from: 'amazontrackerbiz@gmail.com',
      to: recipientEmail,
      subject,
      html,
      attachments: [
        {
          filename: file.originalname,
          path: file.path,
          cid: 'file', // ID для встраивания в HTML
        },
      ],
    }

    // Формируем сообщение
    // const mailOptions = {
    //   from: 'ВАШ_EMAIL@gmail.com',
    //   to: recipientEmail,
    //   subject: `Файл и процент: ${percent}%`,
    //   text: `Вложенный файл и процент: ${percent}%`,
    // attachments: [
    //   {
    //     filename: file.originalname,
    //     path: file.path,
    //     cid: 'file', // ID для встраивания в HTML
    //   },
    // ],
    // }

    // Отправляем email
    await transporter.sendMail(mailOptions)

    res.json({
      success: true,
      message: 'Email отправлен успешно',
    })
  } catch (error) {
    console.error('Ошибка при отправке email:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при отправке email',
    })
  }
})

// Обновленный маршрут с обработкой файла
// app.post('/send-mail', upload.single('file'), (req, res) => {
//   const { recipientEmail, percent } = req.body
//   const file = req.file // доступ к загруженному файлу

//   console.log('recipientEmail, percent', recipientEmail, percent)
//   console.log('file', file)

//   // Здесь ваша логика отправки email и обработки файла
//   res.json({ success: true })
// })

// app.post('/send-mail', upload.none(), (req, res) => {
//   const { recipientEmail, percent } = req.body
//   console.log('recipientEmail, percent', recipientEmail, percent)
//   // Здесь ваша логика отправки email
//   res.json({ success: true })
// })

app.post('/send-maill', (req, res) => {
  const { recipientEmail, percent } = req.body
  console.log('recipientEmail, percent', recipientEmail, percent)
  // console.log('req', req.body)

  return

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
