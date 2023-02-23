export function getUserId() {
	let userId = localStorage.getItem('@aigur/userId');
	if (!userId) {
		userId = makeid(16);
		localStorage.setItem('@aigur/userId', userId);
	}

	return userId;
}

function makeid(length: number = 16) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
