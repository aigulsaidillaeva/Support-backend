const pool = require('../db')

exports.createSupportTicket = async (req, res) => {
  console.log('req.body:', req.body)

const { program, userRole, question, contactInfo } = req.body
const screenshotPath = req.file ? req.file.path.replace(/\\/g, '/') : null

  if (!program || !userRole || !question) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля' })
  }
  try {
 const result = await pool.query(
  `INSERT INTO support_requests 
   (program_name, user_type, question, screenshot_url, contact_info, created_at)
   VALUES ($1, $2, $3, $4, $5, now())
   RETURNING *`,
  [program, userRole, question, screenshotPath, contactInfo]
)
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Ошибка при создании заявки:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}


exports.getAllSupportRequests=async(req,res)=>{
    try {
        const result =await pool.query(` SELECT * FROM support_requests`)
        res.json(result.rows)
        
    } catch (error) {
        console.error('Ошибка при получении заявок', error);
        res.status(500).json({error:'Ошибка сервера'})
        
        
    }
}

const fs = require('fs')
const path = require('path')

exports.deleteSupportRequest = async (req, res) => {
  const { id } = req.params

  try {
    const getResult = await pool.query(`SELECT screenshot_url FROM support_requests WHERE id = $1`, [id])
    if (getResult.rows.length === 0) {
      return res.status(404).json({ message: 'Заявка не найдена' })
    }

    const screenshotPath = getResult.rows[0].screenshot_url

    const deleteResult = await pool.query(`DELETE FROM support_requests WHERE id = $1 RETURNING *`, [id])

    if (screenshotPath) {
      const fullPath = path.join(__dirname, '..', screenshotPath) 
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error('Ошибка при удалении файла:', err)
        } else {
          console.log('Файл успешно удалён:', screenshotPath)
        }
      })
    }

    res.json({ message: 'Удалено' })
  } catch (error) {
    console.error('Ошибка при удалении заявки:', error)
    res.status(500).json({ error: error.message })
  }
}
