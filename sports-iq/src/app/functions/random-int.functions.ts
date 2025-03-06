/**
 * Returns a random number between the provided min and max
 *
 * @param {number } min min value
 * @param {number } max max value
 *
 * @returns {number} The random integer value
 *
 */

export const randomInt = (min: number, max: number): number => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
};
