const userRepository = require('../repository/user-repository');

module.exports = {
  register: async (crendentials) => await userRepository.create(crendentials),
  verifyUserName: async (crendentials) => await userRepository.findByUsername(crendentials),
  verifyPassword: async ({password, passwordEncrypt}) => {
    return password === passwordEncrypt;
  } 
}