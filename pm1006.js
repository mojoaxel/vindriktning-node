/**
 * Helper class to parse serial data from a PM1006 LED Particle Sensor
 * 
 * @see http://www.jdscompany.co.kr/download.asp?gubun=07&filename=PM1006_LED_PARTICLE_SENSOR_MODULE_SPECIFICATIONS.pdf
 * 
 * @author Alexander Wunschik <dev@wunschik.net>
 * @license Beerware_License
 * 
 * @abstract
 */
class PM1006 {
	static BAUDRATE = 9600;
	
	static UNIT_ASCII = 'ug/m3';
	static UNIT_UTF8 = 'µg/m³';
	
	static FRAME_LENGTH = 20;

	/**
	 * Returns true if the buffer starts with the expected header.
	 * The header of a PM1006 frame is always [0x16, 0x11, 0x0B].
	 * 
	 * @private
	 * 
	 * @param {Buffer} buffer (length = FRAME_LENGTH)
	 * @returns {boolean} true if header is valid
	 */
	static #ifHeaderValid(buffer) {
		return (
			(buffer[0] == 0x16) && 
			(buffer[1] == 0x11) && 
			(buffer[2] == 0x0B)
		);
	}

	/**
	 * Returns true if the checksum is valid.
	 * The checksum is the sum of all bytes in the buffer 
	 * with the last byte being the inverse of the sum.
	 * This results in the sum of all bytes being 0.
	 * 
	 * @private
	 * 
	 * @param {Buffer} buffer (length = FRAME_LENGTH)
	 * @returns 
	 */
	static #ifChecksumValid(buffer) {
		return buffer.reduce((checksum, byte) => 
			(checksum + byte) & 0xFF
		, 0) === 0;
	}

	/**
	 * Get the interesting bytes out of the buffer frame
	 * and return them as a simple object.
	 * 
	 * PM2.5 = buffer[5,6]
	 * PM1.0 = buffer[9,10]
	 * PM10 = buffer[13,15] !
	 * 
	 * @private
	 * 
	 * @param {Buffer} buffer (length = FRAME_LENGTH)
	 * @returns {*} values
	 */
	static #parseFrame(buffer) {
		return {
			pm1: ((buffer[9] << 8) | buffer[10]) & 0xFFFF,
			pm2_5: ((buffer[5] << 8) | buffer[6]) & 0xFFFF,
			pm10:  ((buffer[13] << 8) | buffer[15]) & 0xFFFF,
		};
	}

	/**
	 * Takes in one data-frame from a SM1006 device
	 * checks if data is valid and
	 * returns measurement values an a object.
	 * 
	 * @public
	 * 
	 * @param {Buffer} buffer (length = FRAME_LENGTH)
	 */
	static parseDataFrame(buffer) {
		if (!buffer || buffer.length !== this.FRAME_LENGTH) {
			throw new Error('invalid buffer size');
		}
		if (!this.#ifHeaderValid(buffer)) {
			throw new Error('invalid header');
		}
		if (!this.#ifChecksumValid(buffer)) {
			throw new Error('invalid payload');
		}
		return this.#parseFrame(buffer);
	}
}

module.exports = PM1006