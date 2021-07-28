const transfer = {
	setMorKm: function(m) {
		var n = ''
		if (m) {
			if (m >= 1000) {
				n = (m / 1000).toFixed(2) + 'km'
			} else if (m < 1000) {
				n = m + 'm'
			} else {
				n = '0m'
			}
		} else {
			n = '0m'
		}
		return n
	},
}

export default transfer;
