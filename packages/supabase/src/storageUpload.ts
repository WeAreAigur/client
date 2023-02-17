import { z } from 'zod';

import { createClient } from '@supabase/supabase-js';

const inputSchema = z.object({
	supabaseUrl: z.string(),
	supabaseServiceKey: z.string(),
	bucket: z.string(),
	file: z.instanceof(ArrayBuffer),
	extension: z.string(),
	name: z.string().optional(),
});

const outputSchema = z.object({
	url: z.string().url(),
});

export async function supabaseUpload(input: z.input<typeof inputSchema>) {
	const payload = inputSchema.parse(input);
	const supabase = createClient(payload.supabaseUrl, payload.supabaseServiceKey, {
		global: { fetch: fetch.bind(globalThis) },
	});
	const uploadedFile = await uploadFileToStorage(
		payload.file,
		`${payload.name ?? makeid(16)}.${payload.extension}`,
		payload.bucket
	);
	const url = `${payload.supabaseUrl}/storage/v1/object/public/${payload.bucket}/${uploadedFile}`;

	return {
		url,
	};

	async function uploadFileToStorage(file: ArrayBuffer, name: string, bucket: string) {
		const { data, error } = await supabase.storage.from(bucket).upload(name, file);
		if (error) {
			throw error;
		}
		return data?.path;
	}
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
