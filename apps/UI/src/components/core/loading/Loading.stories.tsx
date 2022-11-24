import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Loading, { LoadingTypes } from '.';
import ComponentViewer from '../componentViewer';

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
    <ComponentViewer >
      <Loading {...args} />
    </ComponentViewer>
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
