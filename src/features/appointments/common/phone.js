import api from '../../index';

export default async function willBeReminded(personResourceName) {
  // get finalResourceName here
  const person = await api('getContact', {
    id: personResourceName,
  });
  const userDefined = person && person.userDefined;
  if (userDefined) {
    const validPhoneArray = userDefined.filter(
      (obj) => obj.key === 'validPhone'
    );
    // this is the business logic
    /* i think we must check the whole array */
    return validPhoneArray[0] && validPhoneArray[0].value === 'false';
  }
  return true;
}
