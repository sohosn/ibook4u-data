import rp from 'request-promise';
import { getConfig } from '../../utilities/configs';

const bitlyToken = getConfig('bitly_token');
const reservationURL = getConfig('reservationURL');

export async function urlCreate(options) {
  const { longURL } = options;

  const postOptions = {
    method: 'POST',
    headers: {
      // eslint-disable-next-line camelcase
      Authorization: `Bearer ${bitlyToken}`,
    },
    uri: `https://api-ssl.bitly.com/v4/bitlinks`,
    body: {
      long_url: longURL,
    },
    json: true, // Automatically stringifies the body to JSON
  };

  return rp(postOptions);
}

export async function createShortURL(id) {
  let shortURL = null;
  try {
    shortURL = await urlCreate({
      longURL: `${reservationURL}${id}`,
    });
  } catch (urlError) {
    // console.error('unable to create URL - trying again', urlError);
    shortURL = await urlCreate({
      longURL: `${reservationURL}${id}`,
    });
  }
  return shortURL;
}

export default createShortURL;
