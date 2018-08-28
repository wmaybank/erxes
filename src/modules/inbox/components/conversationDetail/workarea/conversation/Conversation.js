import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Spinner } from 'modules/common/components';
import { TwitterConversation } from './twitter';
import { FacebookConversation } from './facebook';
import { Message } from './messages';
import AttachmentPreview from './AttachmentPreview';

const propTypes = {
  conversation: PropTypes.object,
  conversationMessages: PropTypes.array.isRequired,
  attachmentPreview: PropTypes.object,
  loading: PropTypes.bool
};

const Wrapper = styled.div`
  padding: 20px;
  overflow: hidden;
  min-height: 80px;

  > div:first-child {
    margin-top: 0;
  }
`;

class Conversation extends Component {
  renderMessages() {
    const { conversation, conversationMessages } = this.props;

    if (!conversation) {
      return null;
    }

    let messagesList = conversationMessages || [];

    const messages = messagesList.slice();
    const rows = [];

    let tempId;

    messages.forEach(message => {
      rows.push(
        <Message
          isSameUser={
            message.userId
              ? message.userId === tempId
              : message.customerId === tempId
          }
          message={message}
          key={message._id}
        />
      );

      tempId = message.userId ? message.userId : message.customerId;
    });

    return rows;
  }

  renderConversation() {
    const { loading, conversation, conversationMessages } = this.props;

    if (loading) {
      return <Spinner objective />;
    }

    const twitterData = conversation.twitterData;
    const facebookData = conversation.facebookData;
    const isTweet = twitterData && !twitterData.isDirectMessage;
    const isFacebookPost = facebookData && facebookData.kind !== 'messenger';

    if (isTweet) {
      return (
        <TwitterConversation
          conversation={conversation}
          conversationMessages={conversationMessages}
        />
      );
    }

    if (isFacebookPost) {
      return (
        <FacebookConversation
          conversation={conversation}
          conversationMessages={conversationMessages}
        />
      );
    }

    return this.renderMessages();
  }

  render() {
    const { attachmentPreview } = this.props;

    return (
      <Wrapper>
        {this.renderConversation()}
        <AttachmentPreview
          onLoad={this.context.scrollBottom}
          attachmentPreview={attachmentPreview}
        />
      </Wrapper>
    );
  }
}

Conversation.propTypes = propTypes;

Conversation.contextTypes = {
  scrollBottom: PropTypes.func
};

export default Conversation;
