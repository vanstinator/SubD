import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// export default function configure() {
//   if (process.env.NODE_ENV !== 'production') {
//     dotenv.config();
//   }
// }
