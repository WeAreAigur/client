import { LogSnag } from 'logsnag';

export const logsnag = new LogSnag({
	token: process.env.NEXT_PUBLIC_LOGSNAG_KEY!,
	project: 'aigur',
});
