import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ConnectionMenu from '.';
import CenterElements from '../../core/centerElements';

export default {
  title: 'Connection Menu',
  component: ConnectionMenu,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ConnectionMenu>;

const Template: ComponentStory<typeof ConnectionMenu> = (args) =>
  (
    <CenterElements >
      <ConnectionMenu {...args} />
    </CenterElements>
  )
;

export const Normal = Template.bind({});
Normal.args = {
    conectado : false,
    esperando : false
};
