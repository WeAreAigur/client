import { z } from 'zod';

export function getConcreteNodeInput(
	inputPlaceholders: Record<string, any> | z.ZodEffects<any>,
	values: Record<string, any>
) {
	if (typeof inputPlaceholders === 'string') {
		return handleSingleValue(inputPlaceholders);
	}

	const input: Record<string, any> = { ...inputPlaceholders };

	return getInputContextInner(input);

	function getInputContextInner(input: Record<string, any>) {
		const newInput = {};
		for (const key in input) {
			newInput[key] = handleSingleValue(input[key]);
		}
		return newInput;
	}

	function handleSingleValue(value) {
		if (Array.isArray(value)) {
			return value.map((item) => getInputContextInner(item));
		}
		if (typeof value === 'object' && value !== null) {
			return getInputContextInner(value);
		}

		let newValue: any = value;
		// a single string can contain multiple context references:
		// {text: `$context.1.text$ - $context.0.text$`}
		const contextReferences = getContextReferences(value);

		for (let ref of contextReferences) {
			const contextValue = values[ref.nodeId];
			const propertyValue = contextValue[ref.property];
			if (propertyValue instanceof ArrayBuffer) {
				newValue = propertyValue;
				continue;
			}
			newValue = (newValue as string)?.replace(new RegExp(escapeRegExp(ref.value)), propertyValue);

			if (newValue === 'undefined') {
				newValue = undefined;
			} else if (newValue !== propertyValue && newValue === propertyValue.toString()) {
				newValue = propertyValue;
			}
		}

		return newValue;
	}

	function getContextReferences(value: string) {
		if (typeof value !== 'string') return [];
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
