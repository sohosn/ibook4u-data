import AST from 'auto-sorting-array';
import api from '../../index';

export default async function getAndTouchServices(serviceIds) {
  const listOfServices = await api('listServices');
  const astServices = new AST(listOfServices, 'id');
  const services = serviceIds.map((serviceId) =>
    astServices.getByKey(serviceId)
  );
  api('updateServices', astServices.getArray());
  return services;
}
