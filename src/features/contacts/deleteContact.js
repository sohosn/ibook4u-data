// https://developers.google.com/apis-explorer/?hl=en_US#p/
// babel-node cli --action=updateContact --verified=false --resourceName=people/YYY --mobile=XX
import jwt from '../../utilities/jwt';

const { generatePeopleObj } = jwt;

export default async function get(options) {
  const { resourceName } = options;
  const people = await generatePeopleObj();

  return new Promise((res, rej) => {
    people.people.deleteContact(
      {
        resourceName,
      },
      {},
      (err, { data: obj }) => {
        // console.log(err || obj);
        if (err) {
          rej(err);
        } else {
          res(obj);
        }
      }
    );
  });
}
