import React from 'react';

import Button from 'shared/components/Button';
import Tooltip from 'shared/components/Tooltip';

import feedbackImage from './assets/feedback.png';
import { FeedbackDropdown, FeedbackImageCont, FeedbackImage, FeedbackParagraph } from './Styles';

const UPSTREAM_REPO_URL = 'https://github.com/oldboyxx/jira_clone';

const AboutTooltip = tooltipProps => (
  <Tooltip
    width={300}
    {...tooltipProps}
    renderContent={() => (
      <FeedbackDropdown>
        <FeedbackImageCont>
          <FeedbackImage src={feedbackImage} alt="Give feedback" />
        </FeedbackImageCont>

        <FeedbackParagraph>
          This simplified Jira clone is built with React on the front-end and Node/TypeScript on the
          back-end.
        </FeedbackParagraph>

        <a href={UPSTREAM_REPO_URL} target="_blank" rel="noreferrer noopener">
          <Button variant="primary" icon="github">
            Github Repo
          </Button>
        </a>
      </FeedbackDropdown>
    )}
  />
);

export default AboutTooltip;
