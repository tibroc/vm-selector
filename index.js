fields = []

function load_config() {
	fetch('config.json')
  .then((response) => response.json())
  .then((data) => build_ui(data));
}

function build_ui(config) {
	const selector = document.getElementById('selector');
	for (const key in config) {
		const field = config[key];
		fields.push(key);
		const label = document.createElement('label');
		label.setAttribute('for', key);
		label.innerText = field.hint;
		selector.appendChild(label);
		if (field.type === 'text') {
			const input = document.createElement('input');
			input.setAttribute('type', field.type);
			input.setAttribute('id', key);
			input.setAttribute('name', key);
			if (field.default) {
				input.value = field.default;
			}
			selector.appendChild(input);
		} else if (field.type === 'select') {
			const input = document.createElement('select');
			input.setAttribute('id', key);
			input.setAttribute('name', key);
			for (const value of field.options) {
				const option = document.createElement('option');
				option.setAttribute('value', value);
				option.innerText = value;
				input.appendChild(option);
			}
			if (field.default) {
				input.value = field.default;
			}
			selector.appendChild(input);
		}
	}
}

function add_vm() {
	let args = '';
	for (field of fields) {
		const value = document.getElementById(field).value;
		if (!value) {
			alert(`${field} must not be empty`);
			return;
		}
		args += `${value} `;
	}
	const order = document.getElementById('order');
	const amount = document.getElementById('amount').value;
	for (let i = 0; i < amount; i++) {
		let args_i = args.replaceAll('{i}', pad(i, amount));
		order.innerText = `${order.innerText}\n${args_i}`.trim();
	}
}

function pad(number, max) {
	const len = max.toString().length;
	return number.toString().padStart(len, '0');
}

function copy() {
	const order = document.getElementById('order');
	const text = `Beantragte VMs:\n${order.innerText}\n\nSSh-Key für owner:\nssh-ed25519 AAAAFHLKJC3…`
	navigator.clipboard.writeText(text);
}
