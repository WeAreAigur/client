import { z } from 'zod';

import { createClient } from '@supabase/supabase-js';

export function supabaseUpload(supabaseUrl: string, supabaseKey: string, resultsBucket: string) {
	const supabase = createClient(supabaseUrl, supabaseKey);
	const inputSchema = z.object({
		file: z.instanceof(Buffer),
		extension: z.string(),
		name: z.string().optional().default(makeid()),
	});

	const outputSchema = z.object({
		url: z.string().url(),
	});

	const node = {
		id: 'results.upload.supabase',
		schema: {
			input: inputSchema,
			output: outputSchema,
		},
		action,
	};

	return node;

	async function action(input: z.input<typeof node.schema.input>) {
		const payload: any = node.schema.input.parse(input);
		const uploadedFile = await uploadFileToStorage(
			payload.file,
			`${payload.name}.${payload.extension}`
		);
		const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${resultsBucket}/${uploadedFile}`;

		return {
			url,
		};
	}

	async function uploadFileToStorage(file: Buffer | ArrayBuffer, name: string) {
		const { data, error } = await supabase.storage.from(resultsBucket).upload(name, file);
		if (error) {
			throw error;
		}
		return data?.path;
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
}
