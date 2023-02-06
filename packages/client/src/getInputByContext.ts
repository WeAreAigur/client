export function getInputByContext(rawInput, values) {
	const input: Record<string, any> = { ...rawInput };

	return getInputContextInner(input);

	function getInputContextInner(input) {
		for (const key in input) {
			const value = input[key];

			if (Array.isArray(value)) {
				input[key] = value.map((item) => getInputContextInner(item));
				continue;
			}
			if (typeof value === 'object' && value !== null) {
				input[key] = getInputContextInner(value);
				continue;
			}

			const contextReferences = getContextReferences(value);
			let newValue: any = value;

			for (let ref of contextReferences) {
				const contextValue = values[ref.nodeId];
				const propertyValue = contextValue[ref.property];
				if (propertyValue instanceof Buffer) {
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
