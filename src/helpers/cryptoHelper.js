import bcrypt from 'bcrypt';
// import Cryptr from 'cryptr';

const saltRounds = 10;

export const encrypt = data => bcrypt.hash(data, saltRounds);

export const encryptSync = data => bcrypt.hashSync(data, saltRounds);

export const compare = (data, encrypted) => bcrypt.compare(data, encrypted);

// const cryptoKey = 'YIHxD9A64SOVUuxEKeRYSc1AayIDOpLIitSauw9beKcDWJ9oN9bh6MVkMKt41HH';
// const cryptr = new Cryptr(cryptoKey);

// const decrypt = data => cryptr.decrypt(data);
// export default decrypt;
