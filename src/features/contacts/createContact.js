// https://developers.google.com/apis-explorer/?hl=en_US#p/
import jwt from '../../utilities/jwt';
import api from '../index';

const { generatePeopleObj } = jwt;

export default async function create({ first, last, mobile }) {
  const people = await generatePeopleObj();

  return new Promise((res, rej) => {
    people.people.createContact(
      {
        resource: {
          names: [
            {
              givenName: first,
              familyName: last,
            },
          ],
          phoneNumbers: [
            {
              value: `${mobile}`,
              type: 'mobile',
            },
          ],
        },
      },
      async (err, { data: me }) => {
        // console.log(err || me);
        if (err) {
          rej(err);
        } else {
          // [TEST20191109] - remove "await" from getList
          api('listContacts', { forceRefresh: true });
          res(me);
        }
      }
    );
  });
}
