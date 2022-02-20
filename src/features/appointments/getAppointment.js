// import { AuthTokenPromotionInstance } from 'twilio/lib/rest/accounts/v1/authTokenPromotion';
import { get as getFromDB } from '../../database';

async function getApppointment({ id }) {
  try {
    const apptResponse = await getFromDB(`appt:${id}`);
    const appt = apptResponse.value;
    const { eventId, transId } = appt;

    const eventPromise = getFromDB(`event:${eventId}`);
    const transactionPromise = getFromDB(`trans:${transId}`);

    const results = await Promise.all([eventPromise, transactionPromise]);

    const eventResponse = results[0];
    const transactionResponse = results[1];

    appt.event = eventResponse.value;
    appt.transaction = transactionResponse.value;
    // console.log(`appt=${JSON.stringify(appt, null, 2)}`);
    return appt;
  } catch (error) {
    // console.error('from getAppointment', error);
    return {};
  }
}

export default getApppointment;
