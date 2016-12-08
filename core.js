/*
Copyright (c) 2016,柯禕藍 yhilan.ko@gmail.com

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
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
	Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import YANavigator from 'react-native-ya-navigator';
import Radio, {RadioButton} from 'react-native-simple-radio-button'

import * as GLOBAL from './globals.js';

const dictName = "PhakeDict";
const dictVer = "0.1.0";
const langName = "Phake";
const dictCurator = "Ailot Hailowng";

const styles = require('./styles');

var Sound = require('react-native-sound');

let audioFile;
let audioStatus = false;

/* Load the converted Toolbox data */
var dictionary = require('./dictionary.json');
var searchResults = dictionary;

/* Radio button for selecting what field you're searching */
var radio_props = [
  {label: ' '+langName+' ', value: 0 },
  {label: ' English ', value: 1 }
];

/* Navigation setup */
class AilotDict extends React.Component {render() {return (
	<YANavigator initialRoute={{component: ListPage}}
	navBarStyle={{backgroundColor: '#6B3851'}}
	navBarBackBtn={{textStyle: {color: '#FDFDFD'}}}/>
)}}

/* The screen that gets seen first */
class StartPage extends React.Component {
	render() {
		return (
			<YANavigator.Scene
			delegate={this}
			style={styles.container}>
				<Text style={{fontWeight: "bold", fontSize: 18}}>{dictName}</Text>
				<Text style={styles.text} onPress={() => this.props.navigator.push({component: AboutPage})}>
				{'About ' + dictName}
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
		let theDefinition = entry.definition;
		if (!theDefinition) {
			theDefinition = "(missing definition)"
		} else {
			if (!theDefinition['english']) {
				theDefinition = "(missing definition)"
			} else {
				theDefinition = theDefinition['english']
			}
		}
		return (
			<View style={styles.row}>
				<TouchableOpacity onPress = {this.goToEntry.bind(this,JSON.stringify(entry))}>
					<Text style={styles.script}>{entry.lexeme ? entry.lexeme : "???"}</Text>
					<Text style={styles.headword}>{entry.phonemic ? entry.phonemic : "(missing phonemic)"}</Text>
					<Text style={styles.snippet}>
						{entry.pos ? entry.pos : ''}
						{' '}
						{theDefinition}
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
		this.props.navigator.push({component: EntryPage, props:{backBtnText: 'Back',}})
	}

	static navigationDelegate = {
		id: 'ListPage',
		renderTitle() {
			return (
				<View>
					<Text style={styles.title}>
						{dictName}
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
		<TouchableOpacity onPress={this.props.onPress}>
			<Icon name="menu" size={30} color="#FDFDFD"/>
		</TouchableOpacity>
		)
	}
	static propTypes = {
		onPress: PropTypes.func,
	}
}

class OpenURLButton extends React.Component {
	static propTypes = {
		url: React.PropTypes.string,
	};

	handleClick = () => {
		Linking.canOpenURL(this.props.url).then(supported => {
			if (supported) {
				Linking.openURL(this.props.url);
			} else {
			console.log('Don\'t know how to open URI: ' + this.props.url);
			}
		});
	};

	render() {
		return (
			<TouchableOpacity
			onPress={this.handleClick}>
			<View style={styles.button}>
			<Text style={styles.text}>{this.props.url}</Text>
			</View>
			</TouchableOpacity>
		);
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
				<Text style={{fontSize: 16, fontWeight: "bold"}}>{dictName} ver {dictVer}</Text>
				<Text> </Text>
				<Text style={{fontSize: 16, fontWeight: "bold"}}>Data curation & organisation</Text>
				<Text style={{fontSize: 16}}>{dictCurator}</Text>
				<Text> </Text>
				<Text style={{fontSize: 16, fontWeight: "bold"}}>Project supervision</Text>
				<Text style={{fontSize: 16}}>Stephen Morey</Text>
				<Text> </Text>
				<Text style={{fontSize: 16, fontWeight: "bold"}}>Application development</Text>
				<Text style={{fontSize: 16}}>Kellen Parker van Dam</Text>
				<Text> </Text>
				<Text style={{fontSize: 16}}>© 2016 Phonemica</Text>
				<OpenURLButton url={'https://www.phonemica.net'} />
			</YANavigator.Scene>
		)
	}
	static navigationDelegate = {
	id: 'AboutPage',
	renderTitle() {
		return (
			<View>
				<Text style={styles.title}>
					{'About '+dictName}
				</Text>
			</View>
		)
	}
  }
}

class Playable extends React.Component {

}

class Recording extends React.Component {
	render() {
		return(
			<TouchableOpacity onPress={() => audioFile.play()}>
				<Text><Icon name='volume-up' size={24} style={{color: '#FDFDFD', paddingRight: 10}}/> </Text>
			</TouchableOpacity>
		)
	}
}

/* Individual Entries */
class EntryPage extends React.Component {
	render() {
		audioFile = new Sound(GLOBAL.ENTRY.sound, Sound.MAIN_BUNDLE, (error) => {
			if (error != null) {
				audioStatus = false;
			} else {
				audioStatus = true;
			}
		})
		return (
			<YANavigator.Scene delegate={this} style={styles.container}>
				<Text style={styles.headword}>{GLOBAL.ENTRY.phonemic ? GLOBAL.ENTRY.phonemic : "(missing phonemic)"}</Text>
				<Text style={styles.snippet}>{GLOBAL.ENTRY.definition.english ? GLOBAL.ENTRY.definition.english : "(missing definition)"}</Text>
				<Text style={styles.script}>{GLOBAL.ENTRY.example.script ? GLOBAL.ENTRY.example.script : ""}</Text>
				<Text style={styles.snippet}>{GLOBAL.ENTRY.example.english ? GLOBAL.ENTRY.example.english : ""}</Text>
			</YANavigator.Scene>
		)
	}
	static navigationDelegate = {
		id: 'SingleEntry',
		renderTitle() {
			return (
				<View>
					<Text style={styles.titlescript}>
						{GLOBAL.ENTRY.lexeme}
					</Text>
				</View>
			)
		},
		renderNavBarRightPart() {
			return (
				<Recording/>
			)
		}
	}
}

AppRegistry.registerComponent('AilotDict', () => AilotDict);
