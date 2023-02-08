import { z } from 'zod';

export function getInputByContext(
	rawInput: Record<string, any> | z.ZodEffects<any>,
	values: Record<string, any>
) {
	console.log(`***rawInput`, rawInput);
	if (rawInput instanceof z.ZodEffects<any>) {
		return values['1'];
	}
	const input: Record<string, any> = { ...rawInput };

	return getInputContextInner(input);

	function getInputContextInner(input: Record<string, any>) {
		// if (value instanceof ReadableStream) {
		// 	console.log(`***ReadableStream!!!`);
		// 	input[key] = newValue;
		// 	continue;
		// }

		for (const key in input) {
			const value = input[key];

			console.log(`***value`, value);

			if (Array.isArray(value)) {
				input[key] = value.map((item) => getInputContextInner(item));
				continue;
			}
			if (typeof value === 'object' && value !== null) {
				input[key] = getInputContextInner(value);
				continue;
			}

			let newValue: any = value;
			const contextReferences = getContextReferences(value);

			for (let ref of contextReferences) {
				const contextValue = values[ref.nodeId];
				const propertyValue = contextValue[ref.property];
				if (propertyValue instanceof ArrayBuffer) {
					newValue = propertyValue;
					continue;
				}
				newValue = (newValue as string)?.replace(
					new RegExp(escapeRegExp(ref.value)),
					propertyValue
				);

				if (newValue === 'undefined') {
					newValue = undefined;
				} else if (newValue !== propertyValue && newValue === propertyValue.toString()) {
					newValue = propertyValue;
				}
			}

			input[key] = newValue;
		}
		console.log(`***input`, input);
		return input;
	}

	function getContextReferences(value: string) {
		const contextRegex = /\$context\.(\d+|input)\.(\w+)\$/g;
		const matches = value.matchAll(contextRegex);
		const references: any[] = [];

		for (let match of matches) {
			references.push({
				value: match[0],
				nodeId: match[1],
				property: match[2],
			});
		}

		return references;
	}

	function escapeRegExp(string: string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}
}
