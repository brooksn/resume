require('dotenv-safe').config({silent: true})

module.exports = {
  phone: process.env.PHONE || '',
  email: process.env.EMAIL || '',
  summary: process.env.SUMMARY || '',
  linkedin: process.env.LINKEDIN || '',
  aa_institution: process.env.AA_INSTITUTION || '',
  bs_institution: process.env.BS_INSTITUTION || ''
}
