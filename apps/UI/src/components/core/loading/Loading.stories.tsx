import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Loading, { LoadingTypes } from '.';
import CenterElements from '../centerElements';

export default {
  title: 'Loading Components',
  component: Loading,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Loading>;

const Template: ComponentStory<typeof Loading> = (args) =>
  (
    <CenterElements >
      <Loading {...args} />
    </CenterElements>
  )
;

export const Waiting = Template.bind({});
Waiting.args = {
    type: LoadingTypes.waiting
};

export const Requesting = Template.bind({});
Requesting.args = {
    type: LoadingTypes.requesting
};
