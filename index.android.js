var React = require('react-native');
var {AppRegistry,StyleSheet,Text,View,TextInput,TouchableHighlight,TouchableOpacity,Navigator,ListView,ScrollView,Alert,Image} = React;
var store = require('react-native-simple-store');
var {RouteNavigator,Router} = require('react-native-route-navigator');

/*
	/Users/kellen/Library/Android/sdk/tools/emulator -netdelay none -netspeed full -avd 16_2
*/

var dictionary = require('./dictionary.json');
var searchResults = dictionary;
import * as GLOBAL from './globals.js';

class Base extends React.Component {
	addRoutes(router) {
		router.addRoute("home", "/home/:username/:id", StartPage, {
			defaultAnimation: Navigator.SceneConfigs.FadeAndroid,
		});
		router.addRoute("speaker", "/about/", AboutPage, {
			defaultAnimation: Navigator.SceneConfigs.FloatFromRight,
		});
		router.addRoute("story", "/story/:mongoid/:story", StoryPage, {
			defaultAnimation: Navigator.SceneConfigs.FadeAndroid,
		});
		router.addRoute("settings", "/settings/", SettingsPage, {
			defaultAnimation: Navigator.SceneConfigs.FloatFromRight,
		});
		router.addRoute("entry", "/entry/", EntryPage, {
			defaultAnimation: Navigator.SceneConfigs.FloatFromRight,
		});
	}
	render() {
		return (
			<RouteNavigator
				style={styles.container}
				initialRouteStack={[{name:"/home/柯禕藍/23"}]}
				router={this.router}
				app={this}
			/>
		);
	}
	get router() {
		if (!this._router) {
			this._router = new Router();
			this.addRoutes(this._router);
		}
		return this._router;
	}
}

class StartPage extends React.Component {
	constructor(props) {
		 super(props);
		 this.state = {
				open: false,
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
			<View style={{flex:1}}>
				<View style={styles.toolbar}>
					<Text style={styles.toolbarButton}> </Text>
					<Text style={styles.toolbarTitle}>
						{GLOBAL.LABEL.APPNAME}
					</Text>
					<Text style={styles.toolbarButtonIcon} onPress={this.goToSettings.bind(this)}>{GLOBAL.LABEL.BUTTONS.SETTINGS}</Text>
				</View>
				<TextInput ref='search_term' placeholder='Search' onChangeText={(text) => this.setState({text})} onSubmitEditing={this.doSearching.bind(this,this.state.text)}/>
				<View style={{flex:1}}>
					<ListView
						dataSource={this.state.dataSource}
						renderRow={this.renderItem.bind(this)}
					/>
				</View>
			</View>
		);
	}
	renderItem(entry,index) {
		return (
			<View style={styles.row}>
				<TouchableOpacity onPress={this.goToEntry.bind(
					this,JSON.stringify(entry)
				)}>
				<Text style={{fontSize: 18, color: '#333333'}}>
					<Text style={{fontFamily: 'AhomManuscript-Medium'}}>
						<Text> </Text>{entry.lexeme}
					</Text>
					<Text> </Text>
					<Text style={{fontWeight:'bold'}}>
						{entry.phonemic}
					</Text>
				</Text>
				<Text style={{margin:0}}>
					<Text style={{fontStyle: 'italic'}}>
						{entry.pos}<text> </text>
					</Text>
					{entry.definition.english}
				</Text>
			</TouchableOpacity>
		</View>
		);
	}
	doSearching(term) {
		var numResults = 0;
		var temparray = [];
		//GLOBAL.RESULTS;
		for (var i = 0; i < dictionary.length; i++){
			if (dictionary[i].phonemic == term) {
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
	goToSettings() {
		this.props.nav.push({name: "/settings/"});
	}
	goToEntry(data) {
		GLOBAL.ENTRY = JSON.parse(data);
		/*definitionRows = [];
		for (var i = 0; i < Object.keys(GLOBAL.ENTRY).length; i++) {
			var e = i+1;
			definitionRows.push(
				<View key={Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}>
					<Text style={entry.definition} key={Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}><Text style={{fontWeight: 'bold'}}>{e}.</Text> {GLOBAL.ENTRY[i].definition.english}</Text>
					<View style={entry.example} key={Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}>
						<Text style={entry.examplesScr} key={Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}>{GLOBAL.ENTRY[i].example.script}</Text>
						<Text style={entry.examplesEng} key={Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}>{GLOBAL.ENTRY[i].example.phonemic}</Text>
					</View>
				</View>
			);
		}
		GLOBAL.DEFS = definitionRows;*/
		this.props.nav.push({name:"/entry/"});
	}
	get query() {
		return (this.state || {}).query || {};
	}
}

class StoryPage extends React.Component {
	render() {
		return (<Text>Story</Text>)
	}
	goBack() {
		this.props.nav.pop();
	}
	get query() {
		return (this.state || {}).query || {};
	}
}

class EntryPage extends React.Component {
	render() {
		return (
			<View style={{flex:1}}>
				<View style={styles.toolbar}>
					<Text style={styles.toolbarBackButton} onPress={this.goBack.bind(this)}>{GLOBAL.LABEL.BUTTONS.BACK}</Text>
					<Text style={styles.toolbarTitleScript}>
						{GLOBAL.ENTRY.lexeme}
					</Text>
					<Text style={styles.toolbarButton}> </Text>
				</View>
				<View style={{flex:1, padding: 10, color: '#333333'}}>
					<ScrollView style={{flex:1, fontSize: 18, color: '#333333'}}>
							<Text style={{fontFamily: 'AhomManuscript-Medium'}}>
								<Text> </Text>{GLOBAL.ENTRY.lexeme}
							</Text>
							<Text> </Text>
							<Text style={{fontWeight:'bold'}}>
								{GLOBAL.ENTRY.phonemic}
							</Text>
							<Text style={{fontStyle: 'italic'}}>
								{GLOBAL.ENTRY.pos} {GLOBAL.ENTRY.definition.english}
							</Text>
							<Text style={{fontFamily: 'NotoSansBengali-Regular'}}>
								{GLOBAL.ENTRY.definition.assamese}
							</Text>
							<Text style={{fontFamily: 'AhomManuscript-Medium', color: '#333333'}}>
								<Text> </Text>{GLOBAL.ENTRY.example.script}
							</Text>
							<Text style={{fontFamily: 'NotoSansBengali-Regular'}}>
								{GLOBAL.ENTRY.example.assamese}
							</Text>
							<Text>
								{GLOBAL.ENTRY.example.english}
							</Text>
							<Text style={{fontStyle: 'italic'}}>
								Source: {GLOBAL.ENTRY.reference !== undefined ? GLOBAL.ENTRY.reference : ''}
							</Text>
					</ScrollView>
				</View>
			</View>
		);
	}
	goBack() {
		this.props.nav.pop();
	}
}

class AboutPage extends React.Component {
	render() {
		return (
			<View>
				<View style={styles.toolbar}>
					<Text style={styles.toolbarBackButton} onPress={this.goBack.bind(this)}>{GLOBAL.LABEL.BUTTONS.BACK}</Text>
					<Text style={styles.toolbarTitle}>
						About
					</Text>
					<Text style={styles.toolbarButton}> </Text>
				</View>
				<View style={styles.container}>
					<View style={{margin:10}}>
						<Text><Text style={{fontWeight: 'bold'}}>{GLOBAL.LABEL.APPNAME}</Text> v {GLOBAL.APPINFO.VERSION}</Text>
						<Text>{GLOBAL.APPINFO.DATE}</Text>
						<Text> </Text>
						<Text>Developed by Phonemica</Text>
						<Text>phonemica.net</Text>
						<Text> </Text>
						<Text>{GLOBAL.LABEL.APPNAME} is part of the Phonemica Dictionary project. This dictionary is curated by {GLOBAL.APPINFO.CURATOR}. For questions please contact {GLOBAL.APPINFO.CONTACT.NAME} at {GLOBAL.APPINFO.CONTACT.ADDRESS}</Text>
				</View>
				</View>
			</View>
		);
	}
	goBack() {
		this.props.nav.pop();
	}
	get query() {
		return (this.state || {}).query || {};
	}
}

class SettingsPage extends React.Component {
	signIn() {
		store.save(
			'login', {'un': 'keyilan'}
		).then(() => {
			store.get('login').then((login) => {Alert.alert('signed in as '+login.un)})
		})
	}
	signOut() {
		store.delete('login');
		Alert.alert('signed out');
	}
	signedIn() {
		store.get('login').then((login) => {
			if (login == null){
				Alert.alert('you are signed out')
			} else {
				Alert.alert('signed in as '+login.un)
			}
		});
	}
	render() {
		return (
			<View>
				<View style={styles.toolbarSpecial}>
					<Text style={styles.toolbarBackButton} onPress={this.goBack.bind(this)}>{GLOBAL.LABEL.BUTTONS.BACK}</Text>
					<Text style={styles.toolbarTitle}>
						{GLOBAL.LABEL.SETTINGS}
					</Text>
					<Text style={styles.toolbarButton}> </Text>
				</View>
				<View style={styles.container}>
					<Text style={styles.title}>
						Settings
					</Text>
				</View>
				<TouchableOpacity
					style={styles.button}
					 onPress={this.goToAbout.bind(this)}>
					<Text style={styles.buttonText}>About {GLOBAL.LABEL.APPNAME}</Text>
				</TouchableOpacity>
			</View>
		);
	}
	goToAbout() {
		this.props.nav.push({name: "/about/"});
	}
	goBack() {
		this.props.nav.pop();
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: GLOBAL.COLOR.CONTAINER.BACKGROUND,
	},
	button: {
		margin: 5,
		backgroundColor: GLOBAL.COLOR.CONTAINER.BUTTON,
		padding: 5,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 36,
	},
	buttonText: {
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold',
		margin: 5
	},
	title: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	toolbar: {
		backgroundColor: GLOBAL.COLOR.TOOLBAR.BACKGROUND,
		height: 48,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	toolbarSearch: {
		backgroundColor: GLOBAL.COLOR.TOOLBAR.HIGHLIGHT,
		height: 48,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	toolbarSpecial: {
		backgroundColor: GLOBAL.COLOR.TOOLBAR.SPECIAL,
		height: 48,
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	toolbarButton: {
		width: 50,
		fontSize: 16,
		color: GLOBAL.COLOR.TOOLBAR.TEXT,
		textAlign: 'center'
	},
	toolbarButtonIcon: {
		width: 50,
		fontSize: 20,
		color: GLOBAL.COLOR.TOOLBAR.TEXT,
		textAlign: 'center',
		fontFamily: 'icons'
	},
	toolbarBackButton: {
		width: 50,
		fontSize: 20,
		color: GLOBAL.COLOR.TOOLBAR.TEXT,
		textAlign: 'center',
		fontFamily: 'icons'
	},
	toolbarButtonActive: {
		width: 50,
		fontSize: 16,
		color: GLOBAL.COLOR.TOOLBAR.HIGHLIGHT,
		textAlign: 'center'
	},
	toolbarTitle: {
		color: GLOBAL.COLOR.TOOLBAR.TEXT,
		fontSize: 20,
		textAlign: 'center',
		fontWeight: 'bold',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	toolbarTitleScript: {
		color: GLOBAL.COLOR.TOOLBAR.TEXT,
		fontSize: 26,
		fontFamily: 'AhomManuscript-Medium',
		textAlign: 'center',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	rightContainer: {
		flex: 1
	},
	label: {
		fontSize: 10,
		fontWeight: 'bold',
	},
	row: {
		flex: 1,
		marginBottom: 0,
		paddingBottom: 6,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 0,
		borderBottomColor: GLOBAL.COLOR.CONTAINER.BUTTON,
		borderBottomWidth: 0.5
	}
});
var entry = StyleSheet.create({
	definition: {
		flex: 1,
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 5,
		marginTop: 0
	},
	headwords: {
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 5,
		marginTop: 0,
		fontWeight: 'bold'
	},
	metadata: {
		margin: 10
	},
	example: {
		marginLeft: 30
	},
	examplesEng: {
		marginBottom: 5,
		fontSize: 13,
		fontStyle: 'italic'
	},
	examplesScr: {
		marginBottom: 0,
		fontSize: 18,
		fontFamily: 'AhomManuscript-Medium',
	},
	ahomScript: {
		fontFamily: 'AhomManuscript-Medium',
	}
});

AppRegistry.registerComponent('Base', () => Base);
