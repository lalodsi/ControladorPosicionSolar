import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import MonitorSerial from '.';
import Container, { ContainerType } from '../../core/container';

import "./styles.css"
import ComponentViewer, { ComponentViewerTypes } from '../../core/componentViewer';

export default {
  title: 'Monitor Serial',
  component: MonitorSerial,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof MonitorSerial>;

const Template: ComponentStory<typeof MonitorSerial> = (args) =>
  (
    <ComponentViewer type={ComponentViewerTypes.light}>
      <MonitorSerial { ...args } />
    </ComponentViewer>
  )
;

export const Normal = Template.bind({});
Normal.args = {
    open: false,
    handleClose: () => {}
};
