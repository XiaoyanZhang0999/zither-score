import React, { Component } from "react";
import "../../stylesheets/style.css";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Dot from "@material-ui/icons/FiberManualRecord";
import Line from "@material-ui/icons/Remove";
import DoubleLine from "@material-ui/icons/DragHandle";
import { Dropdown } from "react-bootstrap";
import { graphqlOperation, API } from 'aws-amplify';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import * as subscriptions from '../../graphql/subscriptions';

// Four inputs in one componenet
class SingleScoreInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      num: null,
      pos: []
    };
    console.log(this.props.score);
    this.handleChange = this.handleChange.bind(this);
    this.handleCreateNote = this.handleCreateNote.bind(this);
    this.handleUpdateNote = this.handleUpdateNote.bind(this);
    this.handleDeleteNote = this.handleDeleteNote.bind(this);
  }

  async componentDidMount() {
    const result = await API.graphql(graphqlOperation(queries.listNotes, { limit: 200, 
      filter: {
        scoreId: {
          eq: this.props.score.id
        }
      }}));  

    this.setState({
      notes: result.data.listNotes.items
    });
    console.log(this.state.notes);
  }

  async handleChange(e) {
    e.preventDefault();
    try {
      let { value, min, max } = e.target;
      console.log("inside change");
      console.log(e.target.value);
      if(value) {
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
      }
      else value = null;
      let result = e.target.getAttribute("position").replace(/, +/g, ",").split(",").map(Number);
      
      this.setState({
        num: value,
        pos: result
      }, () => {
        const temp = this.state.notes;
        let exist = false;
        let note_id = "";
        for(let i = 0; i < temp.length; ++i) {
          if(JSON.stringify(temp[i].position) == JSON.stringify(this.state.pos)) {
            note_id = temp[i].id;
            exist = true;
          }
        }
        console.log(exist);
        if(exist) {
          this.state.num ? this.handleUpdateNote(note_id) : this.handleDeleteNote(note_id);
        }
        else {
          this.handleCreateNote();
        }
      });
    }
    catch(e) {
      alert(e.message);
    }
  };

  async handleCreateNote(id) {
    try {
      const noteCreated = await API.graphql(graphqlOperation(mutations.createNote, {
          input: {
            number: this.state.num,
            position: this.state.pos,
            noteScoreId: this.props.score.id,
            scoreId: this.props.score.id
          }
      }));
      this.setState({
        note: noteCreated
      });
    }
    catch(e) {
      alert(e.message);
    }
  }

  async handleUpdateNote(id) {
    const updatedNote = await API.graphql(graphqlOperation(mutations.updateNote, {
        input: {
          id: id,
          number: this.state.num,
          position: this.state.pos
        }
    }));
    console.log(updatedNote);
    
  }

  async handleDeleteNote(id) {
    const deletedNote = await API.graphql(graphqlOperation(mutations.deleteNote,{
        input:{
            id : id
        }
    }));
  }
    
  //console.log(props.nodeLength);
  render() {
    return this.props.lineLength.map(row => (
      <Container className="lineSpacing" key={row} maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={2}>
              <span className="lineBegin">|</span>
              <Grid item>
                {this.props.nodeLength.map(column => (
                  <span key={column}>
                    <span className="row">
                      <span className="dropdown col-xs-12">
                        <Dropdown key="0">
                          <Dropdown.Toggle className="btn btn-sm btn-light">
                            <AddIcon fontSize="small" color="action" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Dot fontSize="small" />
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Line fontSize="small" />
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <DoubleLine fontSize="small" />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </span>
                      <span className="dropdown col-xs-12">
                        <Dropdown key="1">
                          <Dropdown.Toggle className="btn btn-sm btn-light">
                            <AddIcon fontSize="small" color="action" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Dot fontSize="small" />
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Line fontSize="small" />
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <DoubleLine fontSize="small" />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </span>
                      <span className="dropdown col-xs-12">
                        <Dropdown key="2">
                          <Dropdown.Toggle className="btn btn-sm btn-light">
                            <AddIcon fontSize="small" color="action" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Dot fontSize="small" />
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Line fontSize="small" />
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <DoubleLine fontSize="small" />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </span>
                      <span className="dropdown col-xs-12">
                        <Dropdown key="3">
                          <Dropdown.Toggle className="btn btn-sm btn-light">
                            <AddIcon fontSize="small" color="action" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Dot fontSize="small" />
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Line fontSize="small" />
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <DoubleLine fontSize="small" />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </span>
                    </span>
                    <span key={column}>
                      <input
                        key="0"
                        position={[row, column, 0]}
                        className="singleNote"
                        type="number"
                        min="0"
                        max="7"
                        onChange={this.handleChange}
                      />
                      <input
                        key="1"
                        position={[row, column, 1]}
                        className="singleNote"
                        type="number"
                        min="0"
                        max="7"
                        onChange={this.handleChange}
                      />
                      <input
                        key="2"
                        position={[row, column, 2]}
                        className="singleNote"
                        type="number"
                        min="0"
                        max="7"
                        onChange={this.handleChange}
                      />
                      <input
                        key="3"
                        position={[row, column, 3]}
                        className="singleNote"
                        type="number"
                        min="0"
                        max="7"
                        onChange={this.handleChange}
                      />
                      <span className="lineInBetween">|</span>
                    </span>
                  </span>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    ));
  }
};

export default SingleScoreInput;