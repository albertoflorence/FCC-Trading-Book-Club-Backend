const crypto = require('crypto');
const secret = 'abcdefg';

module.exports = (data) => {
  if(!data) return
  const hash = crypto.createHmac('sha256', secret)
    .update(data)
    .digest('hex')
  return hash
}
