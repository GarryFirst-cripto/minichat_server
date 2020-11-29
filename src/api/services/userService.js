import { encrypt } from '../../helpers/cryptoHelper';
import { createToken, createTmptToken, fetchTokenData } from '../../helpers/tokenHelper';
import env from '../../config/dbConfig';
import userRepository from '../../data/repositories/userRepository';

export const getUserById = async userId => {
  const { id, username, email, imageId, image, status } = await userRepository.getUserById(userId);
  return { id, username, email, imageId, image, status };
};

export const getUserNewPwd = async query => {
  const { userHash } = query;
  const { id } = fetchTokenData(userHash.substr(1));
  const user = await getUserById(id);
  if (user) {
    const token = createToken({ id });
    return { token, user };
  }
  return {};
};

export const getUserByEmail = async query => {
  const { mail } = query;
  const usermail = mail.toLowerCase();
  const result = await userRepository.getByEmail(usermail);
  return { isUser: result ? result.password : '' };
};

export const updateUserById = async (id, profile, data) => {
  if (data.status === 200) {
    try {
      const newProfile = {
        ...profile,
        email: profile.email.toLowerCase(),
        password: profile.password ? await encrypt(profile.password) : undefined
      };
      await userRepository.updateById(id, newProfile);
    } catch (er) {
      return { error: true, text: er.name, status: 400 };
    }
  }
  return data;
};

const docHeader = '<!DOCTYPE HTML> <html lang="ru"> <head> <meta charset="utf-8"/>'
  + ' <title> Message from Chat </title> </head> <body>';
const docFooter = '</body> </html>';
const succesMess = reff => (
  '<img src="https://m.io.ua/img_aa/medium/3064/84/30648440.jpg" alt="Картинка" style="margin:'
  + '0px; left: 0px; top: 0px; width: 100%; height: 100%"> <div style="position: absolute; width: 60vw; left: 0;'
  + 'top: 20vh"> <label style="position: absolute; width: 100%; text-align: center; font-size: 5vh" > Successful.'
  + `<br /> Your password was changed ! <br /><br /> <a href="${reff}"> You would go via link</a> </label>`
  + '</div>'
);
const stopMess = (code, message) => (
  '<img src="https://previews.123rf.com/images/arcady31/arcady311305/arcady31130500010/19397645-smiley-with-stop'
  + '-sign-vector-illustration.jpg" alt="Картинка" style="position: absolute; margin: 0px; left: 0px; top: 0px; '
  + 'width: 100%; height: 100%"> <div style="position: absolute; width: 50vw; left: 0; top: 60vh"> <label style='
  + '"position: absolute; width: 100%; text-align: center; font-size: 5vh" > Password NOT changed ! <br /><br />'
  + `Error ${code} <br /> ${message} <br /> </label> </div>`
);

function getErrorText(code, message) {
  return `${docHeader} ${stopMess(code, message)} ${docFooter}`;
}
function getText(reff) {
  return `${docHeader} ${succesMess(reff)} ${docFooter}`;
}

export const resetPassword = async (query, data) => {
  if (data.status === 200) {
    const { pass, mail, hash } = query;
    const usMail = mail.toLowerCase();
    const user = await userRepository.getByEmail(usMail);
    if (user) {
      if (user.password === hash) {
        try {
          const password = pass ? await encrypt(pass) : undefined;
          await userRepository.updateById(user.id, { password });
          const { id } = user;
          return getText(`${env.app.adress}/newpassword?${createTmptToken({ id })}`);
        } catch (er) {
          return getErrorText(400, er.name);
        }
      }
      return getErrorText(403, 'Access denied: hash code did not match !');
    }
    return getErrorText(403, 'Access denied: no such user !');
  }
  return getErrorText(data.status, data.text);
};
