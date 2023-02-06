export function getInputByContext(rawInput, values, schema) {
	const input: Record<string, any> = { ...rawInput };
	// console.log(`***input before`, input);

	for (const key in input) {
		const value = input[key];

		if (typeof value !== 'string') {
			continue;
		}

		const contextReferences = getContextReferences(value);
		console.log(`***contextReferences`, contextReferences);
		let newValue: string | number | boolean | undefined = value;

		// console.log(`***values`, JSON.stringify(values, null, 2));
		for (let ref of contextReferences) {
			const contextValue = values[ref.nodeId];
			// console.log(`***contextValue`, contextValue);
			const propertyValue = contextValue[ref.property];
			// console.log(`***propertyValue`, propertyValue);
			newValue = (newValue as string)?.replace(new RegExp(escapeRegExp(ref.value)), propertyValue);

			if (newValue === 'undefined') {
				newValue = undefined;
			} else if (newValue !== propertyValue && newValue === propertyValue.toString()) {
				newValue = propertyValue;
			} else if (schema.input.shape[key]._def.typeName === 'ZodEffects') {
				// console.log(`ZodEffects`);
				newValue = propertyValue;
			}
		}

		input[key] = newValue;
	}

	// console.log(`***input after`, input);
	return input;

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
