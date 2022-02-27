const fetchData = async () => {
	await fetch(`http://127.0.0.1:3000/`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: null,
		error(err) {
			throw new Error(err);
		},
	});
};
window.addEventListener('load', () => {
	const delBtn = document.querySelector('.btn.btn-danger');
	delBtn.addEventListener('click', () => {
		fetchData();
	});
});
