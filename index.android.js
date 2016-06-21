/*
Copyright (c) 2016 Phonemica

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* Basis setup */
import React, { Component } from 'react';
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
  Image
} from 'react-native';
import YANavigator from 'react-native-ya-navigator';

/* Load the converted Toolbox data */
var dictionary = require('./dictionary.json');
var searchResults = dictionary;

var pushedEntry = 'entry page';

/* Navigation setup */
class AhomDict extends React.Component {render() {return (<YANavigator initialRoute={{component: ListPage}}  navBarStyle={{backgroundColor: '#FBC02D'}} />)}}

/* The screen that gets seen first */
class StartPage extends React.Component {
  render() {
    return (
      <YANavigator.Scene
        delegate={this}
        style={styles.container}>
        <Text style={{fontWeight: "bold", fontSize: 18}}>Tai Ahom Dictionary</Text>
        <Text style={styles.text} onPress={() => this.props.navigator.push({component: AboutPage, props: {leftBtnText: 'Back'}})}>
          {'About the Ahom Dictionary'}
        </Text>
      </YANavigator.Scene>
    )
  }
}

/* The initial list view */
class ListPage extends React.Component {
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
      <YANavigator.Scene
        delegate={this}
        style={styles.container}>
          <View style={{flex:1}}>
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
				<TouchableOpacity onPress={(entry) => this.props.navigator.push({component: EntryPage})}>
				<Text>
					{entry.lexeme}
          {entry.phonemic}
        </Text>
        <Text>
          {entry.pos}
          {entry.definition.english}
				</Text>
			</TouchableOpacity>
		</View>
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
        <Text style={{fontWeight: "bold"}}>AhomDict version 0.1.0</Text>
        <Text>Data collection & organisation by Poppy Gogoi</Text>
        <Text>Application development by Kellen Parker van Dam</Text>
      </YANavigator.Scene>
    )
  }
}

/* Individual Entries */
class EntryPage extends React.Component {
  render() {
    return (
      <YANavigator.Scene
        delegate={this}
        style={styles.container}>
        <Text style={{fontWeight: "bold"}}>{pushedEntry}</Text>
      </YANavigator.Scene>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  row: {
		flex: 1,
		padding: 5,
		borderBottomWidth: 0.5,
    borderColor: "#dddddd"
	}
});

AppRegistry.registerComponent('AhomDict', () => AhomDict);