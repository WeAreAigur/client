function exterior() {
	const nodes = [];

	return new Interior('external', nodes);
}

class Interior {
	constructor(name, nodes) {
		this.name = name;
		this.nodes = nodes;
	}

	transcribe() {
		this.nodes.push({ type: this.name + ':transcribe' });
		return new Interior(Math.floor(Math.random() * 100).toString(), this.nodes);
	}

	getNodes() {
		return this.nodes;
	}
}

const x = exterior();

x.transcribe().transcribe().transcribe();

const nodes = x.getNodes();

console.log(`***nodes`, nodes);
