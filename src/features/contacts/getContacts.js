/* eslint-disable consistent-return */
// https://developers.google.com/apis-explorer/?hl=en_US#p/
const { generatePeopleObj } = require('../../utilities/jwt');

let cache = [];

async function getContacts(previousList, pageToken) {
  const people = await generatePeopleObj();
  return new Promise((res, rej) => {
    people.people.connections.list(
      {
        resourceName: 'people/me',
        personFields: 'names,phoneNumbers',
        pageSize: 1000, // future problem
        pageToken,
      },
      (err, { data }) => {
        if (err) {
          return rej(err);
        }
        // console.log(me.connections.length);
        // console.log(JSON.stringify(me, null, 2));
        const { nextPageToken } = data;
        let contacts = data.connections.filter((contact) =>
          Array.isArray(contact.phoneNumbers)
        );
        contacts = contacts.map((one, index) => {
          const phoneNumbers = one.phoneNumbers.filter(
            (number) => number.type !== 'whatsapp'
          );

          const obj = {
            id: index,
            name:
              one &&
              one.names &&
              one.names.length > 0 &&
              one.names[0].displayName,
            mobile: (
              phoneNumbers[0].canonicalForm ||
              phoneNumbers[0].value ||
              '0'
            ).replace(/\s/g, ''),
            resourceName: one.resourceName,
          };
          obj.display = `${obj.name} - ${obj.mobile}`;
          return obj;
        });

        // to merge with previous list if any
        if (previousList) {
          contacts = contacts.concat(previousList);
        }
        contacts.sort((a, b) => (a.name && a.name.localeCompare(b.name)) || 0);

        const final = [];
        contacts.forEach((item) => {
          if (item.name && item.mobile) final[final.length] = item;
        });
        cache = final;
        return res({ data: final, nextPageToken });
      }
    );
  });
}

export default async function list(options = { forceRefresh: false }) {
  const { forceRefresh } = options;

  if (cache.length > 0 && forceRefresh !== true) {
    return cache;
  }

  // NTF
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (res) => {
    let { data, nextPageToken } = await getContacts();

    while (nextPageToken) {
      // NTF
      // eslint-disable-next-line no-await-in-loop
      const { data: currentData, nextPageToken: pageToken } = await getContacts(
        data,
        nextPageToken
      );
      data = currentData;
      nextPageToken = pageToken;
    }
    // console.log(`data`, data.length)
    return res(data);
  });
}
