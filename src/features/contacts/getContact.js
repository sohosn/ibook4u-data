// https://developers.google.com/apis-explorer/?hl=en_US#p/
// babel-node cli --action=updateContact --verified=false --resourceName=people/YYY --mobile=XX
import jwt from '../../utilities/jwt';

const { generatePeopleObj } = jwt;

export default async function get(options) {
  const { id } = options;
  const people = await generatePeopleObj();

  return new Promise((res, rej) => {
    people.people.get(
      {
        resourceName: id,
        personFields: ['names', 'phoneNumbers', 'userDefined'],
      },
      {},
      (err, obj) => {
        // console.log(id, err || obj);
        if (err) {
          rej(err);
        } else {
          res(obj.data);
        }
      }
    );
  });
}
