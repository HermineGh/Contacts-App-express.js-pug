import Cleave from './cleave';

export default new Cleave('.input-phone', {
	phone: true,
	phoneRegionCode: '{country}',
});
