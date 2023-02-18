import type { AnyZodObject } from 'zod';
import { fromZodError } from 'zod-validation-error';

export function validateInput(schema: AnyZodObject) {
	return (input: unknown) => {
		try {
			schema.parse(input);
			return { valid: true };
		} catch (err) {
			const validationError = fromZodError(err);
			return { valid: false, error: validationError.message };
		}
	};
}
