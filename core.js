/*
Copyright (c) 2016 Phonemica

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* Basis setup */
import React, { Component,PropTypes } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableHighlight,
	TouchableOpacity,
	Navigator,
	ListView,
	ScrollView,
	Alert,
	Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import YANavigator from 'react-native-ya-navigator';
import Radio, {RadioButton} from 'react-native-simple-radio-button'

import * as GLOBAL from './globals.js';

/* Load the converted Toolbox data */
var dictionary = require('./dictionary.json');
var searchResults = dictionary;

/* Radio button for selecting what field you're searching */
var radio_props = [
  {label: ' Ahom ', value: 0 },
  {label: ' English ', value: 1 }
];

/* Navigation setup */
class AhomDict extends React.Component {render() {return (
	<YANavigator initialRoute={{component: ListPage}} 
	navBarStyle={{backgroundColor: '#F85F57'}} 
	navBarBackBtn={{textStyle: {color: '#B31D22'}}}/>
)}}

/* The screen that gets seen first */
class StartPage extends React.Component {
	render() {
		return (
			<YANavigator.Scene
			delegate={this}
			style={styles.container}>
				<Text style={{fontWeight: "bold", fontSize: 18}}>Tai Ahom Dictionary</Text>
				<Text style={styles.text} onPress={() => this.props.navigator.push({component: AboutPage})}>
				{'About the Ahom Dictionary'}
				</Text>
			</YANavigator.Scene>
		)
	}
}

/* Initial list view */
class ListPage extends React.Component {
	renderTitle() {
		return <Text>Title</Text>;
	}
	onNavBarLeftPartPress() {
		this.props.navigator.push({component: AboutPage});
	}
	constructor(props) {
		 super(props);
		 this.state = {
				open: false,
				field: 0,
				uuid: '',
				searchTerm: '',
				dictionary: searchResults,
				dataSource: new ListView.DataSource({
					rowHasChanged: (row1, row2) => row1 !== row2
				}),
				entrySource: new ListView.DataSource({
					rowHasChanged: (row1, row2) => row1 !== row2
				})
		 };
	}
	componentDidMount() {
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(this.state.dictionary)
		})
	}
	render() {
		return (
			<YANavigator.Scene
			delegate={this}
			style={styles.container}>
				<View style={{flex:1}}>
					<TextInput style={styles.textinput} autoCapitalize="none" ref='search_term' placeholder='Search' onChangeText={(text) => this.setState({text})} onSubmitEditing={this.doSearching.bind(this,this.state.text,this.state.field)}/>
					<Radio
						radio_props={radio_props}
						initial={0}
						formHorizontal={true}
						labelHorizontal={true}
						buttonColor={'#444444'}
						animation={true}
						onPress={(value) => {this.setState({field:value})}}
					/>
					<ListView
						dataSource={this.state.dataSource}
						renderRow={this.renderItem.bind(this)}
					/>
				</View>
			</YANavigator.Scene>
		)
	}
	renderItem(entry,index) {
		return (
			<View style={styles.row}>
				<TouchableOpacity onPress = {this.goToEntry.bind(this,JSON.stringify(entry))}>
					<Text style={styles.script}>{entry.lexeme}</Text>
					<Text style={styles.headword}>{entry.phonemic}</Text>
					<Text style={styles.snippet}>
						{entry.pos}
						{' '}
						{entry.definition.english}
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
	doSearching(term,field) {
		term = term.toLowerCase();
		var numResults = 0;
		var temparray = [];
		for (var i = 0; i < dictionary.length; i++){
		if (field == 0) {
			var line = dictionary[i].phonemic;
		} else {
			var line = dictionary[i].definition.english;
		}
		newterm = new RegExp(term, 'g');
			if (line.match(newterm)) {
				temparray.push(dictionary[i]);
			}
		}
		if (temparray.length > 0) {
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(temparray)
			})
		} else {
			Alert.alert('not found');
		}
	}
	
  goToEntry(entry) {
		GLOBAL.ENTRY = JSON.parse(entry),
    	this.props.navigator.push({component: EntryPage,props:{backBtnText: 'Back',}})
	}

	static navigationDelegate = {
		id: 'ListPage',
		renderTitle() {
			return (
				<View>
					<Text style={styles.title}>
						{'Ahom Dictionary'}
					</Text>
				</View>
			)
		},
		renderNavBarLeftPart() {
			return menuButton;
		}
	}
}

class menuButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}>
       <Icon name="menu" size={30} color="#B31D22"/>
      </TouchableOpacity>
    )
  }
  static propTypes = {
    onPress: PropTypes.func,
  }
}


/* About page with basic information */
class AboutPage extends React.Component {
	render() {
		return (
			<YANavigator.Scene
			delegate={this}
			style={styles.container}>
				<Text> </Text>
				<Text style={{fontSize: 16, fontWeight: "bold"}}>AhomDict version 0.1.0</Text>
				<Text> </Text>
				<Text style={{fontSize: 16, fontWeight: "bold"}}>Data collection & organisation</Text>
				<Text style={{fontSize: 16}}>Poppy Gogoi</Text>
				<Text> </Text>
				<Text style={{fontSize: 16, fontWeight: "bold"}}>Application development</Text>
				<Text style={{fontSize: 16}}>Kellen Parker van Dam</Text>
				<Text> </Text>
				<Text style={{fontSize: 16}}>(c) 2016 Phonemica</Text>
				<Text style={{fontSize: 16}}>phonemica.net</Text>
			</YANavigator.Scene>
		)
	}
	static navigationDelegate = {
    id: 'AboutPage',
	renderTitle() {
		return (
			<View>
				<Text style={styles.title}>
					{'About'}
				</Text>
			</View>
		)
	},
  }
}

/* Individual Entries */
class EntryPage extends React.Component {
	render() {
		return (
			<YANavigator.Scene
			delegate={this}
			style={styles.container}>
				<Text style={styles.headword}>{GLOBAL.ENTRY.phonemic}</Text>
				<Text style={styles.snippet}>{GLOBAL.ENTRY.definition.english}</Text>
				<Text style={styles.script}>{GLOBAL.ENTRY.example.script}</Text>
				<Text style={styles.snippet}>{GLOBAL.ENTRY.example.english}</Text>
			</YANavigator.Scene>
		)
	}
	static navigationDelegate = {
		renderTitle() {
			return (
				<View>
					<Text style={styles.titleahom}>
						{GLOBAL.ENTRY.lexeme}
					</Text>
				</View>
			)
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		backgroundColor: '#FDFAF9',
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
		fontWeight: 'bold',
		fontSize: 18,
		color: "#444444"
	},
	snippet: {
		fontSize: 18,
		color: "#444444"
	},
	script: {
		fontSize: 18,
		fontFamily: 'ahom',
		color: "#444444"
	},
	title: {
		color: '#fff',
		fontSize: 20
	},
	titleahom: {
		color: '#fff',
		fontSize: 20,
		fontFamily: 'ahom'
	},
	textinput: {
		height: 46,
	}
});

AppRegistry.registerComponent('AhomDict', () => AhomDict);
