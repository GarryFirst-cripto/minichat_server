import userRepository from '../../data/repositories/userRepository';

async function testUserEmail(email, id) {
  const user = await userRepository.getByEmail(email);
  if ((user) && (user.id !== id)) {
    return { error: true, text: 'User with such E-mail allready exists !', status: 403 };
  }
  return { error: false, text: '', status: 200 };
}

async function testUserName(name, id) {
  const user = await userRepository.getByUsername(name);
  if ((user) && (user.id !== id)) {
    return { error: true, text: 'User with such UserName allready exists !', status: 403 };
  }
  return { error: false, text: '', status: 200 };
}

function testUserPassword(pass) {
  if ((pass) && (pass.length < 5)) {
    return { error: true, text: 'Your password to short !', status: 403 };
  }
  return { error: false, text: '', status: 200 };
}

const updateUserValid = async (req, res, next) => {
  try {
    if (req.body) {
      const {
        username,
        email,
        password
      } = req.body;
      res.data = await testUserEmail(email.toLowerCase(), req.user.id);
      if (res.data.error !== true) {
        res.data = await testUserName(username, req.user.id);
      }
      if (res.data.error !== true) {
        res.data = testUserPassword(password);
      }
    } else {
      res.data = { error: true, text: 'No data in request !', status: 404 };
    }
    next();
  } catch (error) {
    res.data = { error: true, text: error, status: 404 };
    next();
  }
};

export default updateUserValid;
