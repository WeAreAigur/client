import { getContextReferences, placeholdersToConcreteValues } from './getConcreteNodeInput';
import { ConcreteNode, PipelineContext } from './types';

// NOTE: this function mutates the context values -
// we detect if a value is a stream, split it into two and place one of them back into the context.
// context shouldnt be any different (functionality wise) after this function is called
export async function retrieveConcreteMemoryData(
	context: PipelineContext<any, any, any>,
	node: ConcreteNode<any, any, any>
) {
	const { memoryToSave } = node;
	if (!memoryToSave) return;
	const values = placeholdersToConcreteValues(memoryToSave, context.values);
	for (let key in memoryToSave) {
		for (let valueKey in values) {
			const value = values[valueKey];
			if (value instanceof ReadableStream) {
				const refs = getContextReferences(memoryToSave[key]);
				// we split the stream into two, one we return and one we save to memory
				// because we cant read from the same stream twice
				const [output, memoryStream] = value.tee();
				// place the output stream back into the context instead of the old one that we split
				context.values[refs[0].nodeId].output = output;
				// read the memory stream until the end and save it to memory
				const streamOutputValue = await readStreamUntilEnd(memoryStream);
				values[valueKey] = streamOutputValue;
			}
		}
	}
	return values;
}

function readStreamUntilEnd(stream: ReadableStream) {
	return new Promise(async (resolve) => {
		const reader = stream.getReader();
		const decoder = new TextDecoder();
		let done = false;
		let output = '';
		while (!done) {
			const { value, done: doneReading } = await reader.read();
			done = doneReading;
			const chunkValue = decoder.decode(value);
			output += chunkValue;
		}
		resolve(output);
	});
}
