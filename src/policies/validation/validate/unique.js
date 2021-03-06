module.exports = ({data, model, name})  =>
  new Promise((resolve, reject) => {
      const where = {[name]: data}
      model.findOne(where).then(r => 
        !r
        ? resolve() 
        : reject({
            message: `This ${name} already exists, please try something else !`,
            status: 422
      })).catch(err => reject({message: err}))
    })

