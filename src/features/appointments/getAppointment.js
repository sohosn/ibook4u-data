import { get as getFromDB } from '../../database';

async function getApppointment(id) {
  try {
    const apptResponse = await getFromDB(`appt:${id}`);
    const appt = apptResponse.value;
    const { eventId, transId } = appt;

    const eventResponse = await getFromDB(`event:${eventId}`);
    const transactionResponse = await getFromDB(`trans:${transId}`);

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
