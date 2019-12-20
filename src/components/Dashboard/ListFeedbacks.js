import React, { Component } from "react";
import { graphqlOperation, API } from "aws-amplify";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import * as subscriptions from "../../graphql/subscriptions";

class ListFeedbacks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      comment: "",
      feedback_id: "",
      status: "",
      columns: [
        { title: "Name", field: "name" },
        { title: "Email", field: "email" },
        { title: "Date", field: "date" },
        { title: "Status", field: "status" }
      ]
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.handleResolveFeedback = this.handleResolveFeedback.bind(this);
    this.handleIgnoreFeedback = this.handleIgnoreFeedback.bind(this);
    this.handleFetchData = this.handleFetchData.bind(this);
  }

  //get public scores from all users
  async componentDidMount() {
    const limit = 100;
    const result = await API.graphql(
      graphqlOperation(queries.listFeedbacks, { limit })
    );
    console.log(result);

    this.setState({
      feedbacks: result.data.listFeedbacks.items
    });

    this.feedbackUpdationSubscription = API.graphql(
      graphqlOperation(subscriptions.onUpdateFeedback)
    ).subscribe({
      next: feedbackData => {
        const updatedFeedback = feedbackData.value.data.onUpdateFeedback;
        const updatedFeedbacks = this.state.feedbacks.filter(
          feedbacksData => feedbacksData.id !== updatedFeedback.id
        );
        this.setState(
          {
            feedbacks: [...updatedFeedbacks, updatedFeedback]
          },
          () => this.handleFethData()
        );
      }
    });

    this.feedbackDeleteSubscription = API.graphql(
      graphqlOperation(subscriptions.onDeleteFeedback)
    ).subscribe({
      next: feedbackData => {
        const feedbackId = feedbackData.value.data.onDeleteFeedback.id;
        const remainingFeedbacks = this.state.feedbacks.filter(
          feedbacksData => feedbacksData.id !== feedbackId
        );
        this.setState(
          {
            feedbacks: remainingFeedbacks
          },
          () => this.handleFetchData()
        );
      }
    });

    this.handleFetchData();
  }

  componentWillUnmount() {
    if (this.feedbackDeletionSubscription)
      this.feedbackDeletionSubscription.unsubscribe();
    if (this.feedbackUpdationSubscription)
      this.feedbackUpdationSubscription.unsubscribe();
  }

  handleFetchData() {
    this.setState({
      data: this.state.feedbacks.map(feedback => {
        const ID = feedback.id;
        const name = feedback.name;
        const email = feedback.email;
        const date = new Date(feedback.createdAt).toDateString();
        const status = feedback.status;
        const comment = feedback.comment;
        return {
          ID: ID,
          name: name,
          email: email,
          date: date,
          status: status,
          comment: comment
        };
      })
    });
  }

  handleClickOpen(data) {
    this.setState({
      open: true,
      comment: data.comment,
      feedback_id: data.ID,
      status: data.status
    });
  }

  handleClickClose() {
    this.setState({
      open: false
    });
  }

  async handleResolveFeedback() {
    const updatedFeedback = await API.graphql(
      graphqlOperation(mutations.updateFeedback, {
        input: {
          id: this.state.feedback_id,
          status: "Resolved"
        }
      })
    );
    this.handleClickClose();
    return updatedFeedback;
  }

  async handleIgnoreFeedback() {
    const deletedScore = await API.graphql(
      graphqlOperation(mutations.deleteFeedback, {
        input: {
          id: this.state.feedback_id
        }
      })
    );
    this.handleClickClose();
    return deletedScore;
  }

  async handleDeleteFeedback(feedback_id) {
    const deletedFeedback = await API.graphql(
      graphqlOperation(mutations.deleteFeedback, {
        input: {
          id: feedback_id
        }
      })
    );
    return deletedFeedback;
  }

  render() {
    return (
      <Container maxWidth="md">
        <Dialog
          open={this.state.open}
          onClose={this.handleClickClose}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Feedback</DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              {this.state.comment}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            { this.state.status === "Unresolved" ? 
              <>
                <Button onClick={this.handleResolveFeedback} color="primary">
                    Mark as Resolved
                </Button>
                <Button onClick={this.handleIgnoreFeedback} color="primary">
                    Ignore
                </Button>
              </> :
              <>
                <Button onClick={this.handleClickClose} color="primary">
                    Cancel
                </Button>
              </>
            }
          </DialogActions>
        </Dialog>
        <MaterialTable
          title="Feedback"
          columns={this.state.columns}
          data={this.state.data}
          onRowClick={(event, rowData) =>
            this.handleClickOpen(rowData)
          }
        />
      </Container>
    );
  }
}

export default ListFeedbacks;
