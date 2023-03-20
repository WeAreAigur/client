export function isBase64(str: string) {
	try {
		return btoa(atob(str)) === str;
	} catch (err) {
		return false;
	}
}
