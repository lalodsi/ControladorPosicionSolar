import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TopBar from '.';

export default {
  title: 'TopBar',
  component: TopBar,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof TopBar>;

const Template: ComponentStory<typeof TopBar> = (args) => <TopBar {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  handleClose: () => console.log("Cerrando App"),
  handleMinimize: () => console.log("Minimizando App")
};
