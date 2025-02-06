/**
 * Returns sort order for two given parameters to be used by a sort function.
 *
 * @param {number | string | date | boolean} a First value
 * @param {number | string| date | boolean} b Second value
 * @param {boolean} isAsc Sort by ascending order?
 *
 * @returns {number} Sort order (-1, 0, or 1) to be used by a sort function
 *
 */

export const compare = (a: number | string | Date | boolean, b: number | string | Date | boolean, isAsc: boolean): number => {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
};
