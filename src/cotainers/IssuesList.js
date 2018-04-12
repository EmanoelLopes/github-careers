import React, { Component } from "react";

import { IssueListContainer, Loading } from "../components";

import Issue from "./Issue";
import IssueCard from "../components/IssueCard";
import Accordion from "../components/Accordion";

import { connect } from "react-redux";
import { FETCH_ISSUES, FETCH_ISSUES_PAGE } from "../reducers/issues";

class IssuesList extends Component {
  componentDidMount() {
    this.props.fetchIssues();

    window.addEventListener("scroll", this.onScroll);
  }

  onScroll = el => {
    const scroll = el.target.body;
    const currentPosition = window.innerHeight + window.scrollY;
    const aroundEnd = scroll.scrollHeight - 240 <= currentPosition;
    if (aroundEnd) this.getNextPage();
  };

  getNextPage = () => {
    const { loading, page } = this.props.issues;
    if (loading) return;

    this.props.fetchNextPage(page + 1);
  };

  render() {
    const { issues: { data, loading }, filterLabel } = this.props;
    const list = data.map(el => {
      if (
        filterLabel &&
        el.labels.length > 0 &&
        !el.labels.find(e => e.id === filterLabel)
      )
        return null;

      return (
        <Accordion key={el.number}>
          <IssueCard item={el} />
          <Issue item={el} />
        </Accordion>
      );
    });

    return (
    <IssueListContainer>
      {list}
      <Loading isLoading={loading} />
    </IssueListContainer>
    );
  }
}

const mapDispatch = dispatch => ({
  fetchIssues: _ => dispatch({ type: FETCH_ISSUES }),
  fetchNextPage: page => dispatch({ type: FETCH_ISSUES_PAGE, page })
});

export default connect(
  ({ issues, repo: { filterLabel } }) => ({ issues, filterLabel }),
  mapDispatch
)(IssuesList);