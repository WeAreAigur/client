export class NodeDefinitions {
	static Voice = {
		Transcribe: {
			id: 'voice.transcribe',
			input: {
				audio: '',
			},
			output: {
				text: '',
			},
		},
	};

	static Text = {
		Modify: {
			Simple: {
				id: 'text.modify.simple',
				input: {
					text: '',
					modifier: '',
				},
				output: {
					text: '',
				},
			},
			EnhanceWithKeywords: {
				id: 'text.modify.enhanceWithKeywords',
				input: {
					text: '',
				},
				output: {
					text: '',
				},
			},
		},
		Prediction: {
			id: 'text.prediction',
			input: {
				prompt: '',
			},
			output: {
				text: '',
			},
		},
	};

	image = {
		sd: {},
	};

	result = {};
}
