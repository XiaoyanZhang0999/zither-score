import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import CreateModal from "../CreateModal/CreateModal";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import jsPDF from "jspdf";
import { Dropdown } from "react-bootstrap";
import { Auth, graphqlOperation, API } from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import * as subscriptions from "../../graphql/subscriptions";

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      userId: "",
      scores: [],
      notes: [],
      status: "",
      scoreId: ""
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleListScores = this.handleListScores.bind(this);
    this.handleViewScore = this.handleViewScore.bind(this);
    this.handlePrintScore = this.handlePrintScore.bind(this);
    this.handleDeleteScore = this.handleDeleteScore.bind(this);
    this.handleEditScore = this.handleEditScore.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleUpdateScore = this.handleUpdateScore.bind(this);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);

    this.scoreDeletionSubscription = null;
    this.scoreUpdationSubscription = null;
  }

  //get list of scores from all users
  async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser();
    const result = await API.graphql(graphqlOperation(queries.listScores));
    this.setState({
      scores: result.data.listScores.items,
      userId: user.username
    });

    this.scoreDeletionSubscription = API.graphql(
      graphqlOperation(subscriptions.onDeleteScore)
    ).subscribe({
      next: scoreData => {
        const scoreId = scoreData.value.data.onDeleteScore.id;

        const remainingScores = this.state.scores.filter(
          scoresData => scoresData.id !== scoreId
        );
        this.setState({
          scores: remainingScores
        });
      }
    });

    this.scoreUpdationSubscription = API.graphql(
      graphqlOperation(subscriptions.onUpdateScore)
    ).subscribe({
      next: scoreData => {
        const updatedScore = scoreData.value.data.onUpdateScore;
        const updatedScores = this.state.scores.filter(
          scoresData => scoresData.id !== updatedScore.id
        );
        this.setState({
          scores: [...updatedScores, updatedScore]
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.scoreDeletionSubscription)
      this.scoreDeletionSubscription.unsubscribe();
    if (this.scoreUpdationSubscription)
      this.scoreUpdationSubscription.unsubscribe();
  }

  handleShow() {
    this.setState(prevState => {
      return {
        modal: !prevState.modal
      };
    });
  }

  async handleDeleteComment(comment_id) {
    const deletedComment = await API.graphql(
      graphqlOperation(mutations.deleteComment, {
        input: {
          id: comment_id
        }
      })
    );
    return deletedComment;
  }

  async handleDeleteScore(score_id) {
    const deletedScore = await API.graphql(
      graphqlOperation(mutations.deleteScore, {
        input: {
          id: score_id
        }
      })
    );
    const comments = await API.graphql(
      graphqlOperation(queries.listComments, {
        limit: 1000,
        filter: {
          scoreId: {
            eq: score_id
          }
        }
      })
    );
    const temp = comments.data.listComments.items;
    for (let i = 0; i < temp.length; ++i) {
      this.handleDeleteComment(temp[i].id);
    }
    return deletedScore;
  }

  handleEditScore(score_id) {
    this.props.history.push({
      pathname: "/EditScore",
      search: score_id,
      state: {
        score_id: score_id
      }
    });
  }

  handleViewScore(score_id) {
    this.props.history.push({
      pathname: "/ViewScore",
      search: score_id,
      state: {
        score_id: score_id
      }
    });
  }

  async handlePrintScore(score_name, score_id) {
    var doc = new jsPDF(); //pdf created
    doc.setProperties({
      title: score_name
    });
    doc.setFontSize(25);
    doc.setFont("helvetica");
    doc.text(20, 35, score_name); //title
    doc.line(20, 36, 180, 36);
    doc.setFontSize(14);
    doc.text(20, 44, "By: " + this.state.userId); //creator
    var addLineBars = function(i) {
      for (var j = 0; j <= 4; j++) {
        doc.line(20 + j * 40, 50 + i * 25, 20 + j * 40, 65 + i * 25); // horizontal line
      }
    };
    //Get list of notes belonging to this score id
    const noteList = await API.graphql(
      graphqlOperation(queries.listNotes, {
        limit: 200,
        filter: {
          scoreId: {
            eq: score_id
          }
        }
      })
    );
    this.setState({
      notes: noteList.data.listNotes.items
    });
    //Map notes to their corresponding position
    this.state.notes.forEach(note => {
      var pos = note.position; //array of coordinates [row, column, index]
      var data = note.number;
      if (note.dot === "TOP") {
        doc.ellipse(
          25 + pos[1] * 40 + pos[2] * 10,
          50 + pos[0] * 25,
          0.7,
          0.7,
          "F"
        );
      }
      if (note.dot === "BOTTOM") {
        doc.ellipse(
          25 + pos[1] * 40 + pos[2] * 10,
          62 + pos[0] * 25,
          0.7,
          0.7,
          "F"
        );
      }
      if (note.doubleDot === "TOP") {
        doc.ellipse(
          25 + pos[1] * 40 + pos[2] * 10,
          48 + pos[0] * 25,
          0.7,
          0.7,
          "F"
        );
        doc.ellipse(
          25 + pos[1] * 40 + pos[2] * 10,
          50 + pos[0] * 25,
          0.7,
          0.7,
          "F"
        );
      }
      if (note.doubleDot === "BOTTOM") {
        doc.ellipse(
          25 + pos[1] * 40 + pos[2] * 10,
          64 + pos[0] * 25,
          0.7,
          0.7,
          "F"
        );
        doc.ellipse(
          25 + pos[1] * 40 + pos[2] * 10,
          62 + pos[0] * 25,
          0.7,
          0.7,
          "F"
        );
      }
      if (note.line === true) {
        doc.line(
          21 + pos[1] * 40 + pos[2] * 10,
          59 + pos[0] * 25,
          31 + pos[1] * 40 + pos[2] * 10,
          59 + pos[0] * 25
        );
      }
      if (note.doubleLine === true) {
        doc.line(
          21 + pos[1] * 40 + pos[2] * 10,
          60 + pos[0] * 25,
          31 + pos[1] * 40 + pos[2] * 10,
          60 + pos[0] * 25
        );
        doc.line(
          21 + pos[1] * 40 + pos[2] * 10,
          59 + pos[0] * 25,
          31 + pos[1] * 40 + pos[2] * 10,
          59 + pos[0] * 25
        );
      }
      doc.text(
        23 + pos[1] * 40 + pos[2] * 10,
        58 + pos[0] * 25,
        data.toString()
      );
      addLineBars(pos[0]);
    });
    doc.output("dataurlnewwindow"); //pdf exported to new window
  }

  handleChangeStatus(current_status, score_id) {
    this.setState(
      {
        scoreId: score_id,
        status: current_status === "PRIVATE" ? "PUBLIC" : "PRIVATE"
      },
      () => {
        this.handleUpdateScore();
      }
    );
  }

  async handleUpdateScore() {
    const updatedScore = await API.graphql(
      graphqlOperation(mutations.updateScore, {
        input: {
          id: this.state.scoreId,
          status: this.state.status
        }
      })
    );
    return updatedScore;
  }
  //list scores in table
  handleListScores() {
    const temp = this.state.scores;
    let data = [];

    //filter scores so it only contains current user's scores
    for (let i = 0; i < temp.length; ++i) {
      if (temp[i].user.id === this.state.userId) data.push(temp[i]);
    }

    return (
      <div>
        {data.map((score, index) => {
          return (
            <div className="tr" key={index}>
              <div className="td row-title">{score.name}</div>
              <div className="td row-category">{score.category}</div>
              <div className="td row-date">
                {new Date(score.updatedAt).toDateString()}
              </div>
              <div className="td row-sharing">{score.status}</div>
              <div className="td row-options">
                <Dropdown>
                  <Dropdown.Toggle className="btn btn-sm btn-light">
                    <MoreVertIcon />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => this.handleViewScore(score.id)}
                    >
                      View
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.handlePrintScore(score.name, score.id)
                      }
                    >
                      Print
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.handleEditScore(score.id)}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.handleDeleteScore(score.id)}
                    >
                      Delete
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.handleChangeStatus(score.status, score.id)
                      }
                    >
                      Change Status
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="main-library">
        <div className="side-bar">
          <div className="list-tree">
            <div className="inner">
                <span className="t">Scores</span>
            </div>
          </div>
        </div>

        <div className="main-bar">
          <div className="library-content">
            <div className="head-container">
              <div className="header">
                <h2>Scores</h2>
              </div>
            </div>

            <div className="list-container">
              <div className="library-list">
                <div className="thead">
                  <div className="tr">
                    <div className="th row-title sorting">Name</div>
                    <div className="th row-category">Category</div>
                    <div className="th row-date sorting">Date Modified</div>
                    <div className="th row-sharing">Sharing</div>
                    <div className="th row-options"></div>
                  </div>
                </div>
                <div className="tbody">{this.handleListScores()}</div>
                <div
                  infinite-scroll-disabled="infiniteScrollBusy"
                  infinite-scroll-distance="250"
                  className="tbody"
                ></div>
              </div>
            </div>
          </div>
          <div className="inner">
            <button
              onClick={this.handleShow}
              className="btn-lg btn-teal-gradient main-action"
            >
              Create new score
            </button>
          </div>
        </div>
        <CreateModal modal={this.state.modal} handleShow={this.handleShow} />
      </div>
    );
  }
}

export default withRouter(Library);
