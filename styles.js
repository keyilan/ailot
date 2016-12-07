'use strict';

var React = require('react-native');

var {
	StyleSheet,
} = React;

const scriptFont = "phake";

module.exports = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		backgroundColor: '#FDFDFD',
		margin: 0,
		padding: 14
	},
	row: {
		flex: 1,
		padding: 0,
		borderBottomWidth: 0.5,
		borderColor: "#dddddd"
	},
	headword: {
		fontSize: 20,
		color: "#444444",
		fontFamily: 'banchob'
	},
	snippet: {
		fontSize: 18,
		color: "#444444"
	},
	script: {
		fontSize: 24,
		fontFamily: scriptFont,
		color: "#444444"
	},
	title: {
		color: '#FDFDFD',
		fontSize: 20
	},
	titlescript: {
		color: '#FDFDFD',
		fontSize: 30,
		fontFamily: scriptFont
	},
	textinput: {
		height: 46,
	}
});
