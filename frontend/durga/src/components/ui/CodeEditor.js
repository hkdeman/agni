import React, { Component } from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/mode/python';
import 'brace/mode/plain_text';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/json';

import 'brace/theme/monokai';

const styles = {
    editor: {
        width: "100%",
        height: "94.5vh",
    }
}

export default class CodeEditor extends Component {
    constructor(props) {
        super(props);
        this.editorValue = "";
    }

    onChange(value) {
        this.editorValue = value;
    }
    
    render() {
        return(
            <React.Fragment>
                <AceEditor
                    mode={this.props.mode}
                    theme="monokai"
                    name="main-editor"
                    readOnly={false}
                    onChange={this.onChange.bind(this)}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    style={styles.editor}
                    value={this.props.value}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}/>
            </React.Fragment>
        );
    }
}